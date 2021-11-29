import * as React from 'react'

export default function ConnectWalletButton(props) {
  const { isAuthenticating, connectWallet } = props
  return (
    <button className="button" disabled={isAuthenticating} onClick={connectWallet}>
      Connect Your Wallet To Vote
    </button>
  )
}
