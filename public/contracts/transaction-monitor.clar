;; Transaction Monitor Contract
;; This contract monitors suspicious transactions on the Stacks blockchain

;; Define error codes
(define-constant ERR_NOT_OWNER (err u100))
(define-constant ERR_ALREADY_LISTED (err u101))
(define-constant ERR_NOT_LISTED (err u102))

;; Define data structures
(define-data-var large-transaction-threshold uint u1000000)
(define-data-var suspicious-transaction-count uint u0)

;; Define maps for storing watchlist data
(define-map watchlist {addr: principal} {is-listed: bool, category: (string-ascii 50), added-at: uint})
(define-map watchlist-array-index {addr: principal} uint)

;; Define events
(define-event SuspiciousTransactionDetected
    (from: principal)
    (to: principal)
    (amount: uint)
    (timestamp: uint)
    (reason: (string-ascii 100)))

(define-event WatchlistAddressAdded
    (addr: principal)
    (category: (string-ascii 50)))

(define-event WatchlistAddressRemoved
    (addr: principal))

;; Helper functions
(define-private (is-owner? (caller: principal))
    (is-eq caller (as-contract tx-sender)))

(define-private (assert-owner (caller: principal))
    (asserts! (is-owner? caller) ERR_NOT_OWNER))

;; Public functions
(define-public (add-to-watchlist (addr: principal) (category: (string-ascii 50)))
    (begin
        (asserts! (not (get is-listed (unwrap! (map-get? watchlist {addr: addr}) ERR_NOT_LISTED))) ERR_ALREADY_LISTED)
        (map-set watchlist {addr: addr} {
            is-listed: true,
            category: category,
            added-at: block-height
        })
        (map-set watchlist-array-index {addr: addr} (map-len watchlist-array-index))
        (ok (event-emit (WatchlistAddressAdded addr category)))
    ))

(define-public (remove-from-watchlist (addr: principal))
    (begin
        (asserts! (get is-listed (unwrap! (map-get? watchlist {addr: addr}) ERR_NOT_LISTED)) ERR_NOT_LISTED)
        (map-delete watchlist {addr: addr})
        (map-delete watchlist-array-index {addr: addr})
        (ok (event-emit (WatchlistAddressRemoved addr)))
    ))

(define-public (is-suspicious-transaction (from: principal) (to: principal) (amount: uint))
    (begin
        (let ((from-entry (map-get? watchlist {addr: from}))
              (to-entry (map-get? watchlist {addr: to})))
            (cond
                ((is-some from-entry)
                    (ok (tuple (suspicious: true) (reason: (concat "Sender is on watchlist as " (get category (unwrap! from-entry)))))))
                ((is-some to-entry)
                    (ok (tuple (suspicious: true) (reason: (concat "Recipient is on watchlist as " (get category (unwrap! to-entry)))))))
                ((> amount (var-get large-transaction-threshold))
                    (ok (tuple (suspicious: true) (reason: "Large transaction amount"))))
                (else
                    (ok (tuple (suspicious: false) (reason: ""))))
            )
        )
    ))

(define-public (report-suspicious-transaction (from: principal) (to: principal) (amount: uint) (reason: (string-ascii 100)))
    (begin
        (assert-owner tx-sender)
        (var-set suspicious-transaction-count (+ (var-get suspicious-transaction-count) u1))
        (ok (event-emit (SuspiciousTransactionDetected from to amount block-height reason)))
    ))

(define-public (update-large-transaction-threshold (new-threshold: uint))
    (begin
        (assert-owner tx-sender)
        (var-set large-transaction-threshold new-threshold)
        (ok true)
    ))

(define-read-only (get-watchlist-entry (addr: principal))
    (ok (map-get? watchlist {addr: addr})))

(define-read-only (get-large-transaction-threshold)
    (ok (var-get large-transaction-threshold)))

(define-read-only (get-suspicious-transaction-count)
    (ok (var-get suspicious-transaction-count))) 