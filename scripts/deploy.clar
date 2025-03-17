;; Deploy all Stacks Watchdog contracts to testnet
;; This script deploys the contracts in the correct order to establish dependencies

;; Import required contracts
(define-constant CONTRACT_OWNER (as-contract tx-sender))

;; Deploy Transaction Monitor
(define-public (deploy-transaction-monitor)
    (begin
        (print "Deploying Transaction Monitor contract...")
        (contract-call? .transaction-monitor initialize u1000000)
        (ok true)
    ))

;; Deploy Rug Pull Detector
(define-public (deploy-rug-pull-detector)
    (begin
        (print "Deploying Rug Pull Detector contract...")
        (contract-call? .rug-pull-detector initialize u70)
        (ok true)
    ))

;; Deploy Wallet Drainer Detector
(define-public (deploy-wallet-drainer-detector)
    (begin
        (print "Deploying Wallet Drainer Detector contract...")
        (contract-call? .wallet-drainer-detector initialize)
        (ok true)
    ))

;; Deploy Stacks Watchdog Registry
(define-public (deploy-registry)
    (begin
        (print "Deploying Stacks Watchdog Registry contract...")
        (let ((tx-monitor (contract-call? .transaction-monitor get-contract-address))
              (rug-detector (contract-call? .rug-pull-detector get-contract-address))
              (drainer-detector (contract-call? .wallet-drainer-detector get-contract-address)))
            (contract-call? .stacks-watchdog-registry initialize tx-monitor rug-detector drainer-detector)
        )
        (ok true)
    ))

;; Deploy all contracts in sequence
(define-public (deploy-all)
    (begin
        (try! (deploy-transaction-monitor))
        (try! (deploy-rug-pull-detector))
        (try! (deploy-wallet-drainer-detector))
        (try! (deploy-registry))
        (ok true)
    )) 