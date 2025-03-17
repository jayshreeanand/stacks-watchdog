;; SWatchdogRegistry Contract
;; This contract implements the main registry for Stacks Watchdog security monitoring system

;; Define the contract owner
(define-constant contract-owner tx-sender)

;; Define data structures
(define-data-var alert-count uint u0)

;; Define maps for storing data
(define-map alerts { alert-id: uint } { 
    alert-type: (string-ascii 100),
    target-address: principal,
    details: (string-ascii 100),
    timestamp: uint,
    resolved: bool 
})

(define-map subscribers { subscriber: principal } { 
    is-subscribed: bool,
    subscribed-at: uint 
})

;; Define events
(define-event SecurityAlertRaised (
    alert-id: uint,
    alert-type: (string-ascii 100),
    target-address: principal,
    details: (string-ascii 100),
    timestamp: uint
))

(define-event MonitoringComponentUpdated (component-name: (string-ascii 100), component-address: principal))
(define-event AlertSubscriptionUpdated (subscriber: principal, is-subscribed: bool))

;; Raise a security alert
(define-public (raise-security-alert 
    (alert-type (string-ascii 100))
    (target-address principal)
    (details (string-ascii 100)))
    (let ((current-time (get-block-time?)))
        (if (is-none current-time)
            (err u1)
            (let ((alert-id (var-get alert-count)))
                (begin
                    (map-set alerts { alert-id: alert-id } {
                        alert-type: alert-type,
                        target-address: target-address,
                        details: details,
                        timestamp: (unwrap! current-time u1),
                        resolved: false
                    })
                    (var-set alert-count (+ alert-id u1))
                    (emit-event SecurityAlertRaised (event-alert-id alert-type target-address details (unwrap! current-time u1)))
                    (ok true)))))))

;; Update a monitoring component
(define-public (update-monitoring-component (component-name (string-ascii 100)) (component-address principal))
    (if (is-eq tx-sender contract-owner)
        (begin
            (emit-event MonitoringComponentUpdated (event-component-name component-address))
            (ok true))
        (err u1)))

;; Subscribe to alerts
(define-public (subscribe-to-alerts)
    (let ((current-time (get-block-time?)))
        (if (is-none current-time)
            (err u1)
            (begin
                (map-set subscribers { subscriber: tx-sender } {
                    is-subscribed: true,
                    subscribed-at: (unwrap! current-time u1)
                })
                (emit-event AlertSubscriptionUpdated (event-subscriber true))
                (ok true)))))

;; Unsubscribe from alerts
(define-public (unsubscribe-from-alerts)
    (begin
        (map-delete subscribers { subscriber: tx-sender })
        (emit-event AlertSubscriptionUpdated (event-subscriber false))
        (ok true)))

;; Get alert details
(define-read-only (get-alert (alert-id uint))
    (ok (map-get? alerts { alert-id: alert-id })))

;; Check if an address is subscribed
(define-read-only (is-subscribed (addr principal))
    (ok (default-to false (get is-subscribed (map-get? subscribers { subscriber: addr })))))

;; Get total alert count
(define-read-only (get-alert-count)
    (ok (var-get alert-count))) 