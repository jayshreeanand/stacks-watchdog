;; TransactionMonitor Contract
;; This contract implements transaction monitoring functionality for Stacks blockchain

;; Define the contract owner
(define-constant contract-owner tx-sender)

;; Define data structures
(define-data-var large-transaction-threshold uint u1000000) ;; 1 STX
(define-data-var suspicious-transaction-count uint u0)

;; Define maps for storing data
(define-map watchlist { address: principal } { 
    is-listed: bool,
    category: (string-ascii 100),
    added-at: uint 
})

;; Define events
(define-event SuspiciousTransactionDetected (
    from: principal,
    to: principal,
    amount: uint,
    timestamp: uint,
    reason: (string-ascii 100)
))

(define-event WatchlistAddressAdded (address: principal, category: (string-ascii 100)))
(define-event WatchlistAddressRemoved (address: principal))

;; Add an address to the watchlist
(define-public (add-to-watchlist (addr principal) (category (string-ascii 100)))
    (if (is-eq tx-sender contract-owner)
        (let ((current-time (get-block-time?)))
            (if (is-none current-time)
                (err u1)
                (begin
                    (map-set watchlist { address: addr } {
                        is-listed: true,
                        category: category,
                        added-at: (unwrap! current-time u1)
                    })
                    (emit-event WatchlistAddressAdded (event-address category))
                    (ok true))))
        (err u1)))

;; Remove an address from the watchlist
(define-public (remove-from-watchlist (addr principal))
    (if (is-eq tx-sender contract-owner)
        (begin
            (map-delete watchlist { address: addr })
            (emit-event WatchlistAddressRemoved (event-address))
            (ok true))
        (err u1)))

;; Check if an address is on the watchlist
(define-read-only (is-on-watchlist (addr principal))
    (ok (default-to false (get is-listed (map-get? watchlist { address: addr })))))

;; Report a suspicious transaction
(define-public (report-suspicious-transaction 
    (from principal) 
    (to principal) 
    (amount uint) 
    (reason (string-ascii 100)))
    (let ((current-time (get-block-time?)))
        (if (is-none current-time)
            (err u1)
            (begin
                (var-set suspicious-transaction-count (+ (var-get suspicious-transaction-count) u1))
                (emit-event SuspiciousTransactionDetected (event-from to amount (unwrap! current-time u1) reason))
                (ok true)))))

;; Get watchlist entry for an address
(define-read-only (get-watchlist-entry (addr principal))
    (ok (map-get? watchlist { address: addr })))

;; Get suspicious transaction count
(define-read-only (get-suspicious-transaction-count)
    (ok (var-get suspicious-transaction-count))) 