import { useEffect } from 'react'
import { useState } from 'react'

const { ethereum } = window

export default function useWallet() {
  const [currentAccount, setCurrentAccount] = useState(undefined)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const checkForWallet = async () => {
    try {
      if (!ethereum) {
        console.log('You dont seem to have Metamask, man')
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('found authed account:', account)
        setCurrentAccount(account)
      } else {
        console.log('No authed account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    setIsAuthenticating(true)

    try {
      if (!ethereum) {
        return alert('Get MetaMask, man!')
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    } finally {
      setIsAuthenticating(false)
    }
  }

  useEffect(() => {
    checkForWallet()
  }, [])
  return { currentAccount, connectWallet, isAuthenticating }
}
