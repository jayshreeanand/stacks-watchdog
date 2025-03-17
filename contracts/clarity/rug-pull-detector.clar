;; RugPullDetector Contract
;; This contract implements rug pull detection functionality for Stacks tokens

;; Define the contract owner
(define-constant contract-owner tx-sender)

;; Define data structures
(define-data-var rug-pull-threshold uint u70)

;; Define maps for storing data
(define-map token-analyses { token-address: principal } { 
    analyzed: bool,
    is-potential-rug-pull: bool,
    risk-score: uint,
    timestamp: uint 
})

(define-map risk-factors { name: (string-ascii 100) } { 
    exists: bool,
    weight: uint 
})

;; Define events
(define-event TokenAnalyzed (token-address: principal, is-potential-rug-pull: bool, risk-score: uint))
(define-event RiskFactorAdded (name: (string-ascii 100), weight: uint))
(define-event RiskFactorRemoved (name: (string-ascii 100)))

;; Initialize default risk factors
(define-private (initialize-risk-factors)
    (begin
        (map-set risk-factors { name: "no-liquidity-lock" } { exists: true, weight: u80 })
        (map-set risk-factors { name: "unlimited-mint" } { exists: true, weight: u90 })
        (map-set risk-factors { name: "hidden-mint" } { exists: true, weight: u95 })
        (map-set risk-factors { name: "blacklist-functions" } { exists: true, weight: u60 })
        (map-set risk-factors { name: "high-transfer-fees" } { exists: true, weight: u70 })
        (map-set risk-factors { name: "pause-trading" } { exists: true, weight: u75 })
        (map-set risk-factors { name: "upgradeable-proxy" } { exists: true, weight: u50 })
    ))

;; Add a new risk factor
(define-public (add-risk-factor (name (string-ascii 100)) (weight uint))
    (if (is-eq tx-sender contract-owner)
        (begin
            (map-set risk-factors { name: name } { exists: true, weight: weight })
            (emit-event RiskFactorAdded (event-name weight))
            (ok true))
        (err u1)))

;; Remove a risk factor
(define-public (remove-risk-factor (name (string-ascii 100)))
    (if (is-eq tx-sender contract-owner)
        (begin
            (map-delete risk-factors { name: name })
            (emit-event RiskFactorRemoved (event-name))
            (ok true))
        (err u1)))

;; Analyze a token for potential rug pull
(define-public (analyze-token (token-address principal))
    (let ((current-time (get-block-time?)))
        (if (is-none current-time)
            (err u1)
            (let ((risk-score u0))
                (begin
                    ;; Check for various risk factors
                    (if (map-get? risk-factors { name: "no-liquidity-lock" })
                        (set! risk-score (+ risk-score u80)))
                    (if (map-get? risk-factors { name: "unlimited-mint" })
                        (set! risk-score (+ risk-score u90)))
                    (if (map-get? risk-factors { name: "hidden-mint" })
                        (set! risk-score (+ risk-score u95)))
                    (if (map-get? risk-factors { name: "blacklist-functions" })
                        (set! risk-score (+ risk-score u60)))
                    (if (map-get? risk-factors { name: "high-transfer-fees" })
                        (set! risk-score (+ risk-score u70)))
                    (if (map-get? risk-factors { name: "pause-trading" })
                        (set! risk-score (+ risk-score u75)))
                    (if (map-get? risk-factors { name: "upgradeable-proxy" })
                        (set! risk-score (+ risk-score u50)))
                    
                    ;; Store analysis results
                    (map-set token-analyses { token-address: token-address } {
                        analyzed: true,
                        is-potential-rug-pull: (>= risk-score (var-get rug-pull-threshold)),
                        risk-score: risk-score,
                        timestamp: (unwrap! current-time u1)
                    })
                    
                    ;; Emit event
                    (emit-event TokenAnalyzed (event-token-address (>= risk-score (var-get rug-pull-threshold)) risk-score))
                    (ok true)))))))

;; Get analysis results for a token
(define-read-only (get-token-analysis (token-address principal))
    (ok (map-get? token-analyses { token-address: token-address })))

;; Initialize the contract
(initialize-risk-factors) 