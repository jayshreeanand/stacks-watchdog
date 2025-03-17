;; WalletDrainerDetector Contract
;; This contract implements wallet drainer detection functionality for Stacks blockchain

;; Define the contract owner
(define-constant contract-owner tx-sender)

;; Define maps for storing data
(define-map drainer-patterns { pattern: (string-ascii 100) } { 
    exists: bool,
    description: (string-ascii 100),
    added-at: uint 
})

(define-map drainer-contracts { contract-address: principal } { 
    analyzed: bool,
    is-drainer: bool,
    drainer-type: (string-ascii 100),
    detected-at: uint 
})

;; Define events
(define-event DrainerDetected (drainer-address: principal, drainer-type: (string-ascii 100), timestamp: uint))
(define-event DrainerPatternAdded (pattern: (string-ascii 100), description: (string-ascii 100)))
(define-event DrainerPatternRemoved (pattern: (string-ascii 100)))
(define-event ContractAnalyzed (contract-address: principal, is-drainer: bool, drainer-type: (string-ascii 100)))

;; Initialize default drainer patterns
(define-private (initialize-drainer-patterns)
    (let ((current-time (get-block-time?)))
        (if (is-none current-time)
            (err u1)
            (begin
                (map-set drainer-patterns { pattern: "set-approval-for-all" } { 
                    exists: true, 
                    description: "Function that can approve all tokens for transfer",
                    added-at: (unwrap! current-time u1)
                })
                (map-set drainer-patterns { pattern: "unlimited-transfer" } { 
                    exists: true, 
                    description: "Function that can transfer tokens without specific approval",
                    added-at: (unwrap! current-time u1)
                })
                (map-set drainer-patterns { pattern: "hidden-fees" } { 
                    exists: true, 
                    description: "Contract with hidden or excessive fees",
                    added-at: (unwrap! current-time u1)
                })
                (map-set drainer-patterns { pattern: "phishing-signature" } { 
                    exists: true, 
                    description: "Contract requesting signatures that can be used maliciously",
                    added-at: (unwrap! current-time u1)
                })
                (map-set drainer-patterns { pattern: "sweep-token" } { 
                    exists: true, 
                    description: "Function that can sweep all tokens from an address",
                    added-at: (unwrap! current-time u1)
                })
                (ok true)))))

;; Add a new drainer pattern
(define-public (add-drainer-pattern (pattern (string-ascii 100)) (description (string-ascii 100)))
    (if (is-eq tx-sender contract-owner)
        (let ((current-time (get-block-time?)))
            (if (is-none current-time)
                (err u1)
                (begin
                    (map-set drainer-patterns { pattern: pattern } { 
                        exists: true, 
                        description: description,
                        added-at: (unwrap! current-time u1)
                    })
                    (emit-event DrainerPatternAdded (event-pattern description))
                    (ok true))))
        (err u1)))

;; Remove a drainer pattern
(define-public (remove-drainer-pattern (pattern (string-ascii 100)))
    (if (is-eq tx-sender contract-owner)
        (begin
            (map-delete drainer-patterns { pattern: pattern })
            (emit-event DrainerPatternRemoved (event-pattern))
            (ok true))
        (err u1)))

;; Analyze a contract for potential wallet drainer functionality
(define-public (analyze-contract (contract-address principal))
    (let ((current-time (get-block-time?)))
        (if (is-none current-time)
            (err u1)
            (let ((is-drainer false) (drainer-type ""))
                (begin
                    ;; Check for various drainer patterns
                    (if (map-get? drainer-patterns { pattern: "set-approval-for-all" })
                        (begin
                            (set! is-drainer true)
                            (set! drainer-type "approval-drainer")))
                    (if (map-get? drainer-patterns { pattern: "unlimited-transfer" })
                        (begin
                            (set! is-drainer true)
                            (set! drainer-type "transfer-drainer")))
                    (if (map-get? drainer-patterns { pattern: "hidden-fees" })
                        (begin
                            (set! is-drainer true)
                            (set! drainer-type "fee-drainer")))
                    (if (map-get? drainer-patterns { pattern: "phishing-signature" })
                        (begin
                            (set! is-drainer true)
                            (set! drainer-type "phishing-drainer")))
                    (if (map-get? drainer-patterns { pattern: "sweep-token" })
                        (begin
                            (set! is-drainer true)
                            (set! drainer-type "sweep-drainer")))
                    
                    ;; Store analysis results
                    (map-set drainer-contracts { contract-address: contract-address } {
                        analyzed: true,
                        is-drainer: is-drainer,
                        drainer-type: drainer-type,
                        detected-at: (unwrap! current-time u1)
                    })
                    
                    ;; Emit events
                    (emit-event ContractAnalyzed (event-contract-address is-drainer drainer-type))
                    (if is-drainer
                        (emit-event DrainerDetected (event-drainer-address drainer-type (unwrap! current-time u1))))
                    (ok true)))))))

;; Get analysis results for a contract
(define-read-only (get-contract-analysis (contract-address principal))
    (ok (map-get? drainer-contracts { contract-address: contract-address })))

;; Initialize the contract
(initialize-drainer-patterns) 