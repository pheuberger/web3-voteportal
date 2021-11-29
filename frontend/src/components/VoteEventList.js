import * as React from 'react'
import strToCol from 'string-to-color'

export default function VoteEventlist({ events }) {
  const rows = events.map(event => {
    const styles = { backgroundColor: strToCol(event.address) }
    return (
      <li key={event.timestamp}>
        <span className="address" style={styles}>
          {ellipsize(event.address)}
        </span>
        {event.firstVote ? 'cast a vote' : 'changed their vote'} {event.prettyTimestamp}
      </li>
    )
  })
  return <ul>{rows}</ul>
}

function ellipsize(string) {
  if (string == null) return ''
  const start = string.substring(0, 8)
  const end = string.substring(string.length - 5, string.length)
  return `${start}...${end}`
}
