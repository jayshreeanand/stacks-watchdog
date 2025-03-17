;; WalletDrainerDetector contract for Stacks blockchain
;; This contract detects and tracks wallet drainer contracts

;; Error codes
(define-constant ERR_NOT_OWNER (err u1001))
(define-constant ERR_PATTERN_EXISTS (err u1002))
(define-constant ERR_PATTERN_NOT_FOUND (err u1003))
(define-constant ERR_CONTRACT_NOT_FOUND (err u1004))

;; Events
(define-event drainer-detected (drainer-address principal, drainer-type (string-ascii 100), timestamp uint))
(define-event drainer-pattern-added (pattern (string-ascii 100), description (string-ascii 100)))
(define-event drainer-pattern-removed (pattern (string-ascii 100)))
(define-event contract-analyzed (contract-address principal, is-drainer bool, drainer-type (string-ascii 100)))

;; Data structures
(define-data-var owner principal)

;; Pattern data structure
(define-private-data-map drainer-patterns {pattern: (string-ascii 100)} {exists: bool, description: (string-ascii 100), added-at: uint})
(define-private-data-var pattern-list (list 100 (string-ascii 100)))

;; Contract data structure
(define-private-data-map drainer-contracts {contract: principal} {analyzed: bool, is-drainer: bool, drainer-type: (string-ascii 100), detected-at: uint})
(define-private-data-var detected-drainers (list 100 principal))

;; Public functions

;; Initialize the contract
(define-public (initialize (owner-address principal))
    (begin
        (asserts! (is-eq (var-get owner) (as-contract tx-sender)) ERR_NOT_OWNER)
        (var-set owner owner-address)
        ;; Initialize default patterns
        (add-drainer-pattern "setApprovalForAll" "Function that can approve all tokens for transfer")
        (add-drainer-pattern "transferFrom with unlimited approval" "Function that can transfer tokens without specific approval")
        (add-drainer-pattern "hidden fee structure" "Contract with hidden or excessive fees")
        (add-drainer-pattern "phishing signature" "Contract requesting signatures that can be used maliciously")
        (add-drainer-pattern "sweepToken" "Function that can sweep all tokens from an address")
        (ok true)
    )
)

;; Add a new drainer pattern
(define-public (add-drainer-pattern (pattern (string-ascii 100)) (description (string-ascii 100)))
    (begin
        (asserts! (is-eq tx-sender (var-get owner)) ERR_NOT_OWNER)
        (asserts! (not (get pattern (map-get? drainer-patterns {pattern: pattern}))) ERR_PATTERN_EXISTS)
        
        (map-set drainer-patterns {pattern: pattern} {
            exists: true,
            description: description,
            added-at: block-height
        })
        
        (var-set pattern-list (append (var-get pattern-list) (list pattern)))
        (emit-event drainer-pattern-added pattern description)
        (ok true)
    )
)

;; Remove a drainer pattern
(define-public (remove-drainer-pattern (pattern (string-ascii 100)))
    (begin
        (asserts! (is-eq tx-sender (var-get owner)) ERR_NOT_OWNER)
        (asserts! (get exists (map-get? drainer-patterns {pattern: pattern})) ERR_PATTERN_NOT_FOUND)
        
        (map-delete drainer-patterns {pattern: pattern})
        (var-set pattern-list (filter pattern-list (lambda (x) (not (is-eq x pattern)))))
        (emit-event drainer-pattern-removed pattern)
        (ok true)
    )
)

;; Record a contract as a drainer
(define-public (record-drainer-contract (contract-address principal) (drainer-type (string-ascii 100)))
    (begin
        (asserts! (is-eq tx-sender (var-get owner)) ERR_NOT_OWNER)
        
        (let ((contract-data (map-get? drainer-contracts {contract: contract-address})))
            (if (not (get analyzed contract-data))
                (var-set detected-drainers (append (var-get detected-drainers) (list contract-address)))
            )
        )
        
        (map-set drainer-contracts {contract: contract-address} {
            analyzed: true,
            is-drainer: true,
            drainer-type: drainer-type,
            detected-at: block-height
        })
        
        (emit-event drainer-detected contract-address drainer-type block-height)
        (ok true)
    )
)

;; Record a contract as safe
(define-public (record-safe-contract (contract-address principal))
    (begin
        (asserts! (is-eq tx-sender (var-get owner)) ERR_NOT_OWNER)
        
        (map-set drainer-contracts {contract: contract-address} {
            analyzed: true,
            is-drainer: false,
            drainer-type: "",
            detected-at: block-height
        })
        
        (emit-event contract-analyzed contract-address false "")
        (ok true)
    )
)

;; Read-only functions

;; Get all drainer pattern names
(define-read-only (get-drainer-patterns)
    (ok (var-get pattern-list))
)

;; Get drainer pattern details
(define-read-only (get-drainer-pattern-details (pattern (string-ascii 100)))
    (ok (map-get? drainer-patterns {pattern: pattern}))
)

;; Get all detected drainer addresses
(define-read-only (get-detected-drainers)
    (ok (var-get detected-drainers))
)

;; Check if a contract is a known drainer
(define-read-only (is-known-drainer (contract-address principal))
    (ok (map-get? drainer-contracts {contract: contract-address}))
) 