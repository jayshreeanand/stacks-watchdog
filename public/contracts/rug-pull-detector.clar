;; Rug Pull Detector Contract
;; This contract detects potential rug pulls on the Stacks blockchain

;; Define error codes
(define-constant ERR_NOT_OWNER (err u100))
(define-constant ERR_INVALID_WEIGHT (err u101))
(define-constant ERR_RISK_FACTOR_EXISTS (err u102))
(define-constant ERR_RISK_FACTOR_NOT_FOUND (err u103))
(define-constant ERR_INVALID_THRESHOLD (err u104))

;; Define data structures
(define-data-var rug-pull-threshold uint u70)  ;; Default threshold of 70%

;; Define maps for storing data
(define-map token-analyses {token: principal} {
    analyzed: bool,
    is-potential-rug-pull: bool,
    risk-factors: (list (string-ascii 100)),
    risk-score: uint,
    timestamp: uint
})

(define-map risk-factors {name: (string-ascii 100)} {
    exists: bool,
    weight: uint
})

(define-map analyzed-tokens-index {token: principal} uint)

;; Define events
(define-event TokenAnalyzed
    (token: principal)
    (is-potential-rug-pull: bool)
    (risk-factors: (list (string-ascii 100))))

(define-event RiskFactorAdded
    (name: (string-ascii 100))
    (weight: uint))

(define-event RiskFactorRemoved
    (name: (string-ascii 100)))

(define-event RiskFactorWeightUpdated
    (name: (string-ascii 100))
    (new-weight: uint))

;; Helper functions
(define-private (is-owner? (caller: principal))
    (is-eq caller (as-contract tx-sender)))

(define-private (assert-owner (caller: principal))
    (asserts! (is-owner? caller) ERR_NOT_OWNER))

(define-private (is-valid-weight? (weight: uint))
    (and (> weight u0) (<= weight u100)))

(define-private (calculate-risk-score (risk-factors: (list (string-ascii 100))))
    (let ((total-weight u0)
          (factor-count (len risk-factors)))
        (if (= factor-count u0)
            u0
            (let ((iter (map risk-factors (lambda (factor) 
                (let ((weight (get weight (unwrap! (map-get? risk-factors {name: factor}) ERR_RISK_FACTOR_NOT_FOUND))))
                    (set! total-weight (+ total-weight weight))))))
                (average-score (/ total-weight factor-count)))
                average-score)))))

;; Public functions
(define-public (add-risk-factor (name: (string-ascii 100)) (weight: uint))
    (begin
        (assert-owner tx-sender)
        (asserts! (is-valid-weight? weight) ERR_INVALID_WEIGHT)
        (asserts! (not (get exists (unwrap! (map-get? risk-factors {name: name}) ERR_RISK_FACTOR_NOT_FOUND))) ERR_RISK_FACTOR_EXISTS)
        (map-set risk-factors {name: name} {
            exists: true,
            weight: weight
        })
        (ok (event-emit (RiskFactorAdded name weight)))
    ))

(define-public (remove-risk-factor (name: (string-ascii 100)))
    (begin
        (assert-owner tx-sender)
        (asserts! (get exists (unwrap! (map-get? risk-factors {name: name}) ERR_RISK_FACTOR_NOT_FOUND)) ERR_RISK_FACTOR_NOT_FOUND)
        (map-delete risk-factors {name: name})
        (ok (event-emit (RiskFactorRemoved name)))
    ))

(define-public (update-risk-factor-weight (name: (string-ascii 100)) (new-weight: uint))
    (begin
        (assert-owner tx-sender)
        (asserts! (is-valid-weight? new-weight) ERR_INVALID_WEIGHT)
        (asserts! (get exists (unwrap! (map-get? risk-factors {name: name}) ERR_RISK_FACTOR_NOT_FOUND)) ERR_RISK_FACTOR_NOT_FOUND)
        (map-set risk-factors {name: name} {
            exists: true,
            weight: new-weight
        })
        (ok (event-emit (RiskFactorWeightUpdated name new-weight)))
    ))

(define-public (record-token-analysis (token: principal) (detected-risk-factors: (list (string-ascii 100))))
    (begin
        (assert-owner tx-sender)
        (let ((risk-score (calculate-risk-score detected-risk-factors))
              (is-potential-rug-pull (>= risk-score (var-get rug-pull-threshold))))
            (if (not (get analyzed (unwrap! (map-get? token-analyses {token: token}) ERR_RISK_FACTOR_NOT_FOUND)))
                (map-set analyzed-tokens-index {token: token} (map-len analyzed-tokens-index)))
            (map-set token-analyses {token: token} {
                analyzed: true,
                is-potential-rug-pull: is-potential-rug-pull,
                risk-factors: detected-risk-factors,
                risk-score: risk-score,
                timestamp: block-height
            })
            (ok (event-emit (TokenAnalyzed token is-potential-rug-pull detected-risk-factors)))
        )
    ))

(define-public (update-rug-pull-threshold (new-threshold: uint))
    (begin
        (assert-owner tx-sender)
        (asserts! (and (>= new-threshold u0) (<= new-threshold u100)) ERR_INVALID_THRESHOLD)
        (var-set rug-pull-threshold new-threshold)
        (ok true)
    ))

;; Read-only functions
(define-read-only (get-token-analysis (token: principal))
    (ok (map-get? token-analyses {token: token})))

(define-read-only (get-risk-factor (name: (string-ascii 100)))
    (ok (map-get? risk-factors {name: name})))

(define-read-only (get-rug-pull-threshold)
    (ok (var-get rug-pull-threshold))) 