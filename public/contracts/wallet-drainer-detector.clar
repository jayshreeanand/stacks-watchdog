;; Wallet Drainer Detector Contract
;; This contract detects wallet drainer contracts by analyzing patterns

;; Define error codes
(define-constant ERR_NOT_OWNER (err u1001))
(define-constant ERR_PATTERN_EXISTS (err u1002))
(define-constant ERR_PATTERN_NOT_FOUND (err u1003))
(define-constant ERR_CONTRACT_NOT_FOUND (err u1004))

;; Define events
(define-event DrainerPatternAdded (pattern (string-ascii 100)))
(define-event DrainerPatternRemoved (pattern (string-ascii 100)))
(define-event DrainerContractDetected (contract principal) (drainer-type (string-ascii 100)))
(define-event SafeContractRecorded (contract principal))

;; Data structures
(define-data-var owner principal)

;; Pattern data structure
(define-map drainer-patterns {pattern: (string-ascii 100)} {exists: bool, description: (string-ascii 100), added-at: uint})
(define-data-var pattern-list (list 100 (string-ascii 100)) (list))

;; Contract data structure
(define-map drainer-contracts {contract: principal} {analyzed: bool, is-drainer: bool, drainer-type: (string-ascii 100), detected-at: uint})
(define-data-var detected-drainers (list 100 principal) (list))

;; Initialize the contract
;; This function must be called once after deployment
(define-public (initialize (owner-address principal))
  (begin
    (asserts! (is-eq tx-sender contract-caller) (err u1000))
    (var-set owner owner-address)
    (ok true)
  )
)

;; Private helper functions
(define-private (is-owner)
  (is-eq tx-sender (var-get owner))
)

;; Add a new drainer pattern to the database
(define-public (add-drainer-pattern (pattern (string-ascii 100)) (description (string-ascii 100)))
  (let
    (
      (existing-pattern (map-get? drainer-patterns {pattern: pattern}))
      (current-list (var-get pattern-list))
    )
    (asserts! (is-owner) ERR_NOT_OWNER)
    (asserts! (is-none existing-pattern) ERR_PATTERN_EXISTS)
    
    ;; Add pattern to map
    (map-set drainer-patterns {pattern: pattern} {
      exists: true,
      description: description,
      added-at: block-height
    })
    
    ;; Add to list
    (var-set pattern-list (append current-list pattern))
    
    ;; Emit event
    (print (merge {event: "drainer-pattern-added"} {pattern: pattern, description: description}))
    (ok true)
  )
)

;; Remove a drainer pattern from the database
(define-public (remove-drainer-pattern (pattern (string-ascii 100)))
  (let
    (
      (existing-pattern (map-get? drainer-patterns {pattern: pattern}))
      (current-list (var-get pattern-list))
    )
    (asserts! (is-owner) ERR_NOT_OWNER)
    (asserts! (is-some existing-pattern) ERR_PATTERN_NOT_FOUND)
    
    ;; Remove from map
    (map-delete drainer-patterns {pattern: pattern})
    
    ;; Remove from list (filter out the pattern)
    (var-set pattern-list (filter (lambda (p) (not (is-eq p pattern))) current-list))
    
    ;; Emit event
    (print (merge {event: "drainer-pattern-removed"} {pattern: pattern}))
    (ok true)
  )
)

;; Record a contract as a wallet drainer
(define-public (record-drainer-contract (contract-address principal) (drainer-type (string-ascii 100)))
  (let
    (
      (existing-contract (map-get? drainer-contracts {contract: contract-address}))
      (current-list (var-get detected-drainers))
    )
    (asserts! (is-owner) ERR_NOT_OWNER)
    
    ;; Add to map
    (map-set drainer-contracts {contract: contract-address} {
      analyzed: true,
      is-drainer: true,
      drainer-type: drainer-type,
      detected-at: block-height
    })
    
    ;; Add to list if not already in it
    (if (is-some existing-contract)
      (ok true)
      (begin
        (var-set detected-drainers (append current-list contract-address))
        (ok true)
      )
    )
  )
)

;; Record a contract as safe (not a wallet drainer)
(define-public (record-safe-contract (contract-address principal))
  (let
    (
      (existing-contract (map-get? drainer-contracts {contract: contract-address}))
    )
    (asserts! (is-owner) ERR_NOT_OWNER)
    
    ;; Add to map
    (map-set drainer-contracts {contract: contract-address} {
      analyzed: true,
      is-drainer: false,
      drainer-type: "",
      detected-at: u0
    })
    
    ;; Emit event
    (print (merge {event: "safe-contract-recorded"} {contract: contract-address}))
    (ok true)
  )
)

;; Read-only functions

;; Get all drainer patterns
(define-read-only (get-drainer-patterns)
  (var-get pattern-list)
)

;; Get details for a specific pattern
(define-read-only (get-drainer-pattern-details (pattern (string-ascii 100)))
  (map-get? drainer-patterns {pattern: pattern})
)

;; Get all detected drainer contracts
(define-read-only (get-detected-drainers)
  (var-get detected-drainers)
)

;; Check if a contract is a known drainer
(define-read-only (is-known-drainer (contract-address principal))
  (let
    (
      (contract-info (map-get? drainer-contracts {contract: contract-address}))
    )
    (if (is-some contract-info)
      (get is-drainer (unwrap-panic contract-info))
      false
    )
  )
) 