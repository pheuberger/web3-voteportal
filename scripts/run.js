const main = async () => {
  const [owner, randomPerson, anotherRando] = await hre.ethers.getSigners()
  const voteContractFactory = await hre.ethers.getContractFactory('VotePortal')
  const voteContract = await voteContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  })
  await voteContract.deployed()

  console.log('Contract deployed to:', voteContract.address)
  console.log('Contract deployed by:', owner.address)

  await showBalance(voteContract)

  await printResult(voteContract)

  try {
    let txn = await voteContract.upvote()
    await txn.wait()
  } catch (error) {
    console.log(error)
  }

  try {
    txn = await voteContract.connect(randomPerson).upvote()
    await txn.wait()
  } catch (error) {
    console.log(error)
  }

  try {
    txn = await voteContract.connect(anotherRando).downvote()
    await txn.wait()
  } catch (error) {
    console.log(error)
  }

  try {
    txn = await voteContract.upvote()
    await txn.wait()
  } catch (error) {
    console.log(error.message)
  }

  await printResult(voteContract)
  const yeah = await voteContract.getVote()
  console.log('you voted', yeah.direction)

  // const result = await voteContract.getVoteEvents()
  // console.log(result)

  await showBalance(voteContract)

  const [tally, total] = await voteContract.getResult()
  const nTotal = Number(total)
  const nTally = Number(tally)
  const numUpvotes = Math.floor(nTotal / 2) + (nTally > 0 ? nTally : 0)
  console.log('up %d, down %d', numUpvotes, nTotal - numUpvotes)
}

async function showBalance(contract) {
  const contractBalance = await hre.ethers.provider.getBalance(contract.address)
  console.log('contract balance: ', hre.ethers.utils.formatEther(contractBalance))
}

async function printResult(contract) {
  const [tally, total] = await contract.getResult()
  console.log('Tally: %s, Total Votes: %s', tally.toString(), total.toString())
}

async function runMain() {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

runMain()
