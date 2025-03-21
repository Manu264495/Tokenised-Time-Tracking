document.addEventListener("DOMContentLoaded", async () => {
    const connectWalletBtn = document.getElementById("connectWallet");
    const startWorkBtn = document.getElementById("startWork");
    const stopWorkBtn = document.getElementById("stopWork");
    const userAddressSpan = document.getElementById("userAddress");
    const tokenBalanceSpan = document.getElementById("tokenBalance");
    const dashboard = document.getElementById("dashboard");

    let userAccount;
    let contract;

    // Smart contract details
    const contractAddress = "0xc64A69E9BFC7e91F0121E09d5cf95dE0D9cB0F37"; // Replace with deployed contract address
    const contractABI = [[
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_ratePerSecond",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "freelancer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "startTime",
                    "type": "uint256"
                }
            ],
            "name": "WorkStarted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "freelancer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "endTime",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokensEarned",
                    "type": "uint256"
                }
            ],
            "name": "WorkStopped",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "ratePerSecond",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "startWork",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "stopWork",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "workSessions",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "freelancer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "startTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "endTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "tokensEarned",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
        // Contract ABI (shortened for simplicity)
        {
            "inputs": [],
            "name": "startWork",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "stopWork",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    // Connect wallet
    async function connectWallet() {
        if (window.ethereum) {
            try {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                userAccount = accounts[0];
                userAddressSpan.textContent = userAccount;

                // Initialize contract
                const web3 = new Web3(window.ethereum);
                contract = new web3.eth.Contract(contractABI, contractAddress);

                // Fetch token balance
                updateBalance();
                dashboard.classList.remove("hidden");
            } catch (error) {
                console.error("Wallet connection failed", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    }

    // Start work session
    async function startWork() {
        if (!contract) return alert("Connect your wallet first!");
        try {
            await contract.methods.startWork().send({ from: userAccount });
            startWorkBtn.classList.add("hidden");
            stopWorkBtn.classList.remove("hidden");
        } catch (error) {
            console.error("Error starting work:", error);
        }
    }

    // Stop work session
    async function stopWork() {
        if (!contract) return alert("Connect your wallet first!");
        try {
            await contract.methods.stopWork().send({ from: userAccount });
            startWorkBtn.classList.remove("hidden");
            stopWorkBtn.classList.add("hidden");
            updateBalance();
        } catch (error) {
            console.error("Error stopping work:", error);
        }
    }

    // Fetch token balance
    async function updateBalance() {
        if (!contract) return;
        try {
            const balance = await contract.methods.balanceOf(userAccount).call();
            tokenBalanceSpan.textContent = (balance / 1e18).toFixed(4);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }

    // Event listeners
    connectWalletBtn.addEventListener("click", connectWallet);
    startWorkBtn.addEventListener("click", startWork);
    stopWorkBtn.addEventListener("click", stopWork);
});
