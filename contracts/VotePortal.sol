// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract VotePortal {

  struct Vote {
    uint256 timestamp;
    int8 direction;
  }

  mapping(address => Vote) votes;

  event NewVoteEvent(address indexed from, uint256 timestamp, bool firstVote);

  struct VoteEvent {
    address voter;
    uint256 timestamp;
    bool firstVote;
  }

  VoteEvent[] voteEvents;

  uint256 totalVotes;
  int256 tally;

  uint256 private seed;

  constructor() payable {
    console.log("smartest contract alive");
    seed = (block.timestamp + block.difficulty) % 100;
  }

  function upvote() public returns (bool) {
    Vote memory currentVote = getVote();
    bool isFirstVote = true;

    spamProtect();

    if (currentVote.direction == 1) {
      console.log("%s has upvoted already", msg.sender);
      return false;
    } else if (currentVote.direction == -1) {
      undoVote(currentVote);
      isFirstVote = false;
    }

    doVote(1, isFirstVote);
    console.log("%s has upvoted :)", msg.sender);
    runRaffle();
    return true;
  }

  function downvote() public returns (bool) {
    Vote memory currentVote = getVote();
    bool isFirstVote = true;

    spamProtect();

    if (currentVote.direction == -1) {
      console.log("%s has downvoted already", msg.sender);
      return false;
    } else if (currentVote.direction == 1) {
      undoVote(currentVote);
      isFirstVote = false;
    }

    doVote(-1, isFirstVote);
    console.log("%s has downvoted :(", msg.sender);
    return true;
  }

  function doVote(int8 _direction, bool isFirstVote) private {
    votes[msg.sender] = Vote(block.timestamp, _direction);
    tally += _direction;
    totalVotes += 1;
    voteEvents.push(VoteEvent(msg.sender, block.timestamp, isFirstVote));
    emit NewVoteEvent(msg.sender, block.timestamp, isFirstVote);
  }

  function undoVote(Vote memory _currentVote) private {
    console.log("%s changed their mind", msg.sender);
    tally -= _currentVote.direction;
    totalVotes -= 1;
    votes[msg.sender] = Vote(block.timestamp, 0);
  }

  function runRaffle() private {
    seed = (block.difficulty + block.timestamp + seed) % 100;

    if (seed <= 85) {
      return;
    }

    uint256 prizeAmount = 0.001 ether;
    require(
      prizeAmount <= address(this).balance,
      "Tryna withdraw more money than contract has."
    );
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require(success, "Failed to withdraw money from contract.");
    if (success) {
      console.log("yay, %s won the raffle", msg.sender);
    }
  }

  function spamProtect() private view {
    Vote memory vote = getVote();
    require(vote.timestamp + 5 minutes < block.timestamp, "Wait 5m, man");
  }

  function getVote() public view returns (Vote memory) {
    return votes[msg.sender];
  }

  function getResult() public view returns (int256 _tally, uint256 _totalVotes) {
    return (tally, totalVotes);
  }

  function getVoteEvents() public view returns (VoteEvent[] memory){
    return voteEvents;
  }
}
