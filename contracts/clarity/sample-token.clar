;; Sample Token Contract
;; This contract implements a basic token with transfer and balance functionality

;; Define the contract owner
(define-constant contract-owner tx-sender)

;; Define the token data structure
(define-data-var total-supply uint u1000000)
(define-map balances { owner: principal } { amount: uint })

;; Define events
(define-event TransferEvent (sender: principal, recipient: principal, amount: uint))
(define-event MintEvent (recipient: principal, amount: uint))
(define-event BurnEvent (owner: principal, amount: uint))

;; Initialize the contract owner's balance
(define-private (initialize-balance)
    (map-set balances { owner: contract-owner } { amount: (var-get total-supply) }))

;; Get balance of an address
(define-public (get-balance (owner principal))
    (ok (default-to u0 (get amount (map-get? balances { owner: owner })))))

;; Transfer tokens between addresses
(define-public (transfer (recipient principal) (amount uint))
    (let ((sender tx-sender))
        (let ((sender-balance (default-to u0 (get amount (map-get? balances { owner: sender })))))
            (if (<= amount sender-balance)
                (let ((new-sender-balance (- sender-balance amount))
                      (recipient-balance (default-to u0 (get amount (map-get? balances { owner: recipient }))))
                      (new-recipient-balance (+ recipient-balance amount)))
                    (begin
                        (map-set balances { owner: sender } { amount: new-sender-balance })
                        (map-set balances { owner: recipient } { amount: new-recipient-balance })
                        (emit-event TransferEvent (event-sender recipient amount))
                        (ok true)))
                (err u1)))))

;; Mint new tokens (only contract owner can mint)
(define-public (mint (recipient principal) (amount uint))
    (if (is-eq tx-sender contract-owner)
        (let ((recipient-balance (default-to u0 (get amount (map-get? balances { owner: recipient }))))
              (new-recipient-balance (+ recipient-balance amount))
              (new-total-supply (+ (var-get total-supply) amount)))
            (begin
                (map-set balances { owner: recipient } { amount: new-recipient-balance })
                (var-set total-supply new-total-supply)
                (emit-event MintEvent (event-recipient amount))
                (ok true)))
        (err u1)))

;; Burn tokens
(define-public (burn (amount uint))
    (let ((sender tx-sender))
        (let ((sender-balance (default-to u0 (get amount (map-get? balances { owner: sender })))))
            (if (<= amount sender-balance)
                (let ((new-sender-balance (- sender-balance amount))
                      (new-total-supply (- (var-get total-supply) amount)))
                    (begin
                        (map-set balances { owner: sender } { amount: new-sender-balance })
                        (var-set total-supply new-total-supply)
                        (emit-event BurnEvent (event-sender amount))
                        (ok true)))
                (err u1)))))

;; Initialize the contract
(initialize-balance) 