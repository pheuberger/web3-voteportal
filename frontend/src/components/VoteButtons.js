import * as React from 'react'
import { VoteDirection } from '../types'

export default function VoteButtons(props) {
  const { isMining, callbackFn } = props
  return (
    <>
      <button className="button" disabled={isMining} onClick={() => callbackFn(VoteDirection.Up)}>
        Yeah, go on{' '}
        <span aria-label="thumbs up" role="img">
          👍
        </span>
      </button>

      <button className="button" disabled={isMining} onClick={() => callbackFn(VoteDirection.Down)}>
        Nah, stop{' '}
        <span aria-label="thumbs down" role="img">
          👎
        </span>
      </button>
    </>
  )
}
