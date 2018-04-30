module.exports = function(app, key) {

	const RpcClient = require('node-json-rpc2').Client;
	const config = {
	    protocol:'http',//Optional. Will be http by default
	    host: key.host,//Will be 127.0.0.1 by default
	    user: key.user,//Optional, only if auth needed
	    password: key.password,//Optional. Can be named 'pass'. Mandatory if user is passed.
	    port: key.port,//Will be 8443 for https or 8080 for http by default
	    method:'POST'//Optional. POST by default
	};

	function rpcCall(method, ...arg) {		
		console.log(arg);
		return new Promise((resolve, reject) => {
			const client = new RpcClient(config);
			client.call({
			    method,//Mandatory
			    params: arg,//Will be [] by default
			    id:'rpcExample',//Optional. By default it's a random id
			    jsonrpc:'2.0'//Optional. By default it's 2.0
			},(err, data)=>{
			    if(err){	       
			       reject(err);
			    }		    
			    resolve(data);
			});
		});
		
	}

	app.getblockchaininfo = function(){
		return new Promise((resolve, reject) => {
			rpcCall('getblockchaininfo').then((result) => {
				resolve(result);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	app.getnetworkinfo = function(){
		return new Promise((resolve, reject) => {
			rpcCall('getnetworkinfo').then((result) => {
				resolve(result);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	app.getwalletinfo = function() {
		return new Promise((resolve, reject) => {
			rpcCall('getwalletinfo').then((result) => {
				resolve(result);
			}).catch((err) => {
				reject(err);
			});
		});
	}


	app.getbalance = function() {
		return new Promise((resolve, reject) => {
			rpcCall('getbalance').then((result) => {
				resolve(result);
			}).catch((err) => {				
				reject(err);
			});
		});
	}

	app.get('/listaccounts', (req, res) => {
		rpcCall('listaccounts').then((result) => {
			res.json({"flag": 1, "data": result});
		}).catch((err) => {
			console.error(err);
			res.json({"flag": 0});
		});
	});

	app.get('/listreceivedbyaccount', (req, res) => {
		rpcCall('listreceivedbyaccount').then((result) => {
			res.json({"flag": 1, "data": result});
		}).catch((err) => {
			console.error(err);
			res.json({"flag": 0});
		});
	});

	app.get('/listreceivedbyaddress', (req, res) => {
		rpcCall('listreceivedbyaddress').then((result) => {
			res.json({"flag": 1, "data": result});
		}).catch((err) => {
			console.error(err);
			res.json({"flag": 0});
		});
	});

	app.listtransactions = function(){
		return new Promise((resolve, reject) => {
			rpcCall('listtransactions').then((result) => {
				resolve(result);
			}).catch((err) => {			
				reject(err);
			});
		});
	}

	app.gettransaction = function(txid) {
		return new Promise((resolve, reject) => {
			if(!txid){
				reject("no txid");
				return;			
			}		

			rpcCall('gettransaction', txid).then((result) => {
				resolve(result);
			}).catch((err) => {			
				reject(err);
			});
		});
	}


	app.post('/walletpassphrase', (req, res) => {
		const passphrase = req.body.passphrase;
		const timeout = req.body.timeout;

		if(!passphrase || !timeout) {
			res.json({"flag": 0});
			return;
		}		

		rpcCall('walletpassphrase', passphrase, parseInt(timeout)).then((result) => {
			res.json({"flag": 1});
		}).catch((err) => {
			console.error(err);
			res.json({"flag": 0});
		});
	});

	app.post('/backupwallet', (req, res) => {
		const backup_name = req.body.backup;
		if(!backup_name){
			res.json({"flag": 0});
			return;
		}

		rpcCall('backupwallet', backup_name).then((result) => {
			res.json({"flag": 1});
		}).catch((err) => {
			console.error(err);
			res.json({"flag": 0});
		});
	});

	app.post('/importwallet', (req, res) => {
		const backup_name = req.body.backup;
		if(!backup_name){
			res.json({"flag": 0});
			return;
		}

		rpcCall('importwallet', backup_name).then((result) => {
			res.json({"flag": 1});
		}).catch((err) => {
			console.error(err);
			res.json({"flag": 0});
		});
	});

}