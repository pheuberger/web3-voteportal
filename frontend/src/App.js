import * as React from 'react'
import './App.css'
import Loader from 'react-loader-spinner'
import pfp from './assets/moi.png'
import VoteEventlist from './components/VoteEventList'
import ConnectWalletButton from './components/ConnectWalletButton'
import VoteButtons from './components/VoteButtons'
import useWallet from './hooks/useWallet'
import useVotePortalContract from './hooks/useVotePortalContract'

export default function App() {
  const { currentAccount, ...walletBindings } = useWallet()
  const { isMining, doVote, voteEvents, voteResult } = useVotePortalContract(currentAccount != null)

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">🗳 Vote Now!</div>

        <div className="results">
          {currentAccount && (
            <div className="votecount">
              <div className="type">
                <span aria-label="thumbs up" role="img">
                  👍
                </span>
              </div>
              <div className="count">{voteResult.up}</div>
            </div>
          )}
          <div className="center">
            <img alt="flippi" src={pfp} />
          </div>
          {currentAccount && (
            <div className="votecount">
              <div className="type">
                <span aria-label="thumbs down" role="img">
                  👎
                </span>
              </div>
              <div className="count">{voteResult.down}</div>
            </div>
          )}
        </div>
        <div className="bio">
          Hey, I'm <span className="bold">flippi</span>. Should I continue learning web3?
        </div>

        <div className="explainer">
          Don't worry you can always change your vote. Oh, by the way, there's a decent chance that you win 0.001 eth
          when you upvote. Only on upvotes you ask? Yup, not gonna deny it{' '}
          <span role="img" aria-label="shrug">
            🤷‍♂️
          </span>
        </div>

        {isMining ? (
          <Loader className="loader" type="Bars" color="#00BFFF" height={48} width={48} />
        ) : (
          <div className="buttons">
            {currentAccount ? (
              <VoteButtons isMining={isMining} callbackFn={doVote} />
            ) : (
              <ConnectWalletButton {...walletBindings} />
            )}
          </div>
        )}
        {currentAccount && (
          <div className="votelist">
            <h3>Vote Log</h3>
            {voteEvents && <VoteEventlist events={voteEvents} />}
          </div>
        )}
      </div>
    </div>
  )
}
