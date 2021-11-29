const main = async () => {
  const [deployer] = await hre.ethers.getSigners()
  const accountBalance = await deployer.getBalance()

  console.log('Deploying contracts with account: ', deployer.address)
  console.log('Account balance: ', accountBalance.toString())

  const factory = await hre.ethers.getContractFactory('VotePortal')
  const contract = await factory.deploy({ value: hre.ethers.utils.parseEther('0.04') })
  await contract.deployed()

  console.log('VotePortal address: ', contract.address)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()
