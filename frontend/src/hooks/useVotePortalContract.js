import { useEffect } from 'react'
import { ethers } from 'ethers'
import { useState } from 'react'
import abi from '../utils/VotePortal.json'
import { DateTime } from 'luxon'
import { VoteDirection } from '../types'
const { ethereum } = window

const contractAddress = '0xC5cEd652AE4e297e5085b1468a72716c0EaE8E4f'
const contractABI = abi.abi

export default function useVotePortalContract(isAuthed) {
  const [isMining, setIsMining] = useState(false)
  const [voteEvents, setVoteEvents] = useState(false)
  const [voteResult, setVoteResult] = useState({ up: 0, down: 0 })
  const [lastUpdated, setLastUpdated] = useState('')

  const getVoteEvents = async () => {
    const votePortalContract = getContract(ethereum)
    if (!votePortalContract) {
      return console.log("Couldn't get contract")
    }

    const voteEvents = await votePortalContract.getVoteEvents()
    const voteEventsCleaned = cleanAndSortVoteEvents(voteEvents)
    setVoteEvents(voteEventsCleaned)
  }

  const getTally = async () => {
    const votePortalContract = getContract(ethereum)
    if (!votePortalContract) {
      return console.log("Couldn't get contract")
    }

    const [tally, total] = await votePortalContract.getResult()
    setVoteResult(calcUpAndDownvotes(total, tally))
  }

  const doVote = async direction => {
    try {
      const votePortalContract = getContract(ethereum)
      if (!votePortalContract) {
        return console.log("Couldn't get contract")
      }

      setIsMining(true)
      let txn
      if (direction === VoteDirection.Up) {
        txn = await votePortalContract.upvote({ gasLimit: 300000 })
        console.log('Mining upvote...', txn.hash)
      } else {
        txn = await votePortalContract.downvote({ gasLimit: 300000 })
        console.log('Mining downvote...', txn.hash)
      }
      await txn.wait()
      console.log('Mined ...', txn.hash)
    } catch (error) {
      console.log(error)
    } finally {
      setIsMining(false)
    }
  }

  const loadState = async () => {
    console.log('loading state')
    return Promise.all([getTally(), getVoteEvents()])
  }

  function onNewVote(from, timestamp, firstVote) {
    console.log('got a new vote', from, timestamp, firstVote)
    setLastUpdated(timestamp)
  }

  useEffect(() => {
    loadState()
  }, [lastUpdated])

  useEffect(() => {
    if (!isAuthed) return

    const contract = getContract(ethereum)
    contract.on('NewVoteEvent', onNewVote)
    loadState()

    return () => {
      if (!contract) return
      contract.off('NewVoteEvent', onNewVote)
    }
  }, [isAuthed])

  return { isMining, doVote, voteEvents, voteResult }
}

function getContract(ethereum) {
  if (!ethereum) {
    return console.log("Ethereum object doesn't exist")
  }

  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  return new ethers.Contract(contractAddress, contractABI, signer)
}

function cleanAndSortVoteEvents(voteEvents) {
  const voteEventsCleaned = []
  voteEvents.forEach(event => {
    voteEventsCleaned.push(decodeVoteEvent(event.voter, event.timestamp, event.firstVote))
  })
  return voteEventsCleaned.sort((left, right) => right.timestamp - left.timestamp)
}

function decodeVoteEvent(voter, timestamp, firstVote) {
  return {
    address: voter,
    timestamp: Number(timestamp),
    prettyTimestamp: DateTime.fromMillis(timestamp * 1000).toRelative(),
    firstVote: firstVote,
  }
}

function calcUpAndDownvotes(total, tally) {
  const nTotal = Number(total)
  const nTally = Number(tally)
  const numUpvotes = (nTotal + nTally) / 2
  const numDownvotes = (nTotal - nTally) / 2
  console.log(nTotal, nTally)
  console.log('up %d, down %d', numUpvotes, numDownvotes)
  return { up: numUpvotes, down: numDownvotes }
}
