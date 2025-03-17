;; Stacks Watchdog Registry Contract
;; Main registry contract for Stacks Watchdog security monitoring system

;; Define error codes
(define-constant ERR_NOT_OWNER (err u100))
(define-constant ERR_INVALID_COMPONENT (err u101))
(define-constant ERR_ALERT_NOT_FOUND (err u102))
(define-constant ERR_ALERT_RESOLVED (err u103))
(define-constant ERR_ALREADY_SUBSCRIBED (err u104))
(define-constant ERR_NOT_SUBSCRIBED (err u105))

;; Define data structures
(define-data-var alert-count uint u0)

;; Define maps for storing data
(define-map monitoring-components {name: (string-ascii 100)} principal)

(define-map alerts {id: uint} {
    alert-type: (string-ascii 100),
    target-address: principal,
    details: (string-ascii 200),
    timestamp: uint,
    resolved: bool
})

(define-map subscribers {addr: principal} bool)
(define-map subscriber-list-index {addr: principal} uint)

;; Define events
(define-event SecurityAlertRaised
    (alert-id: uint)
    (alert-type: (string-ascii 100))
    (target-address: principal)
    (details: (string-ascii 200))
    (timestamp: uint))

(define-event MonitoringComponentUpdated
    (component-name: (string-ascii 100))
    (component-address: principal))

(define-event AlertSubscriptionUpdated
    (subscriber: principal)
    (is-subscribed: bool))

;; Helper functions
(define-private (is-owner? (caller: principal))
    (is-eq caller (as-contract tx-sender)))

(define-private (assert-owner (caller: principal))
    (asserts! (is-owner? caller) ERR_NOT_OWNER))

;; Public functions
(define-public (update-monitoring-component (component-name: (string-ascii 100)) (component-address: principal))
    (begin
        (assert-owner tx-sender)
        (asserts! (not (is-eq component-address (as-contract tx-sender))) ERR_INVALID_COMPONENT)
        (map-set monitoring-components {name: component-name} component-address)
        (ok (event-emit (MonitoringComponentUpdated component-name component-address)))
    ))

(define-public (raise-security-alert (alert-type: (string-ascii 100)) (target-address: principal) (details: (string-ascii 200)))
    (begin
        (assert-owner tx-sender)
        (let ((alert-id (var-get alert-count)))
            (var-set alert-count (+ alert-id u1))
            (map-set alerts {id: alert-id} {
                alert-type: alert-type,
                target-address: target-address,
                details: details,
                timestamp: block-height,
                resolved: false
            })
            (ok (event-emit (SecurityAlertRaised alert-id alert-type target-address details block-height)))
        )
    ))

(define-public (resolve-alert (alert-id: uint))
    (begin
        (assert-owner tx-sender)
        (let ((alert (unwrap! (map-get? alerts {id: alert-id}) ERR_ALERT_NOT_FOUND)))
            (asserts! (not (get resolved alert)) ERR_ALERT_RESOLVED)
            (map-set alerts {id: alert-id} {
                alert-type: (get alert-type alert),
                target-address: (get target-address alert),
                details: (get details alert),
                timestamp: (get timestamp alert),
                resolved: true
            })
            (ok true)
        )
    ))

(define-public (subscribe)
    (begin
        (asserts! (not (unwrap! (map-get? subscribers {addr: tx-sender}) ERR_NOT_SUBSCRIBED)) ERR_ALREADY_SUBSCRIBED)
        (map-set subscribers {addr: tx-sender} true)
        (map-set subscriber-list-index {addr: tx-sender} (map-len subscriber-list-index))
        (ok (event-emit (AlertSubscriptionUpdated tx-sender true)))
    ))

(define-public (unsubscribe)
    (begin
        (asserts! (unwrap! (map-get? subscribers {addr: tx-sender}) ERR_NOT_SUBSCRIBED) ERR_NOT_SUBSCRIBED)
        (map-delete subscribers {addr: tx-sender})
        (map-delete subscriber-list-index {addr: tx-sender})
        (ok (event-emit (AlertSubscriptionUpdated tx-sender false)))
    ))

;; Read-only functions
(define-read-only (get-alert (alert-id: uint))
    (ok (map-get? alerts {id: alert-id})))

(define-read-only (get-monitoring-component (component-name: (string-ascii 100)))
    (ok (map-get? monitoring-components {name: component-name})))

(define-read-only (is-subscriber (addr: principal))
    (ok (map-get? subscribers {addr: addr})))

(define-read-only (get-alert-count)
    (ok (var-get alert-count))) 