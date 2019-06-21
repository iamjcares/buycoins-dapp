
function isInstalled() {
    return typeof window.ethereum !== 'undefined' ? true : false;
}
function connectBrowser(mintBox, totalSupply, errView) {
    ethereum.enable().catch(function (reason) {
        errView.innerHTML = "Error: User denied account authorization";
    }).then(function () {
        if (ethereum.networkVersion === "4") {
            address = ethereum.selectedAddress;
            window.contract = web3.eth.contract(tokenAbi).at("0xc66b254dc52a782742b81a067cb1f2b1b85fd0b0"); // using injected web3
            setInterval(() => {
                contract.totalSupply((err, bal) => {
                    contract.decimals((err, decimals) => {
                        window.tokenDecimal = decimals; // assigning global variable;
                        totalSupply.innerHTML = bal.div(Math.pow(10, decimals.toNumber()));
                    });
                });
            }, 5000); // check for updated total supply every 5 secs;
            mintBox.style = "display: block";
        } else {
            errView.innerHTML = "You must be connected to Rinkeby Network";
        }
    });
}

(function () {
    let error = document.getElementById('error');
    let info = document.getElementById('info');
    let quantity = document.getElementById('quantity');
    let totalSupply = document.getElementById('totalSupply');
    let mintBtn = document.getElementById('mint');
    let mintBox = document.querySelector('.mintBox');
    let isConnected = isInstalled();
    if (isConnected) {
        connectBrowser(mintBox, totalSupply, error);
    } else {
        error.innerHTML = "You will need MetaMask to use this application";
    }

    mintBtn.addEventListener('click', function (e) {
        error.innerHTML = info.innerHTML = '';
        if (isConnected) {
            ethereum.enable().then(() => {
                let unit = quantity.value;

                if (unit !== '' && unit > 0) {
                    unit = (unit * Math.pow(10, tokenDecimal)).toString();
                    contract.mint(unit, (err, res) => {
                        if (err) {
                            error.innerHTML = err;
                        } else {
                            info.innerHTML = `Token will be minted at <a target="_blank" href="https://rinkeby.etherscan.io/tx/${res}">Rinkeby Tx</a>`;
                            quantity.value = '';
                        }
                    });
                } else {
                    error.innerHTML = "Please enter a valid quantity";
                }
            }).catch(function (reason) {
                error.innerHTML = "Error: User denied account authorization";
            });
        } else {
            error.innerHTML = "YOu're yet to be connected to a network";
        }
    });



})();
