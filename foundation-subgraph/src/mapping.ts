import {
	TokenIPFSPathUpdated as TokenIPFSPathUpdatedEvent,
	Transfer as TransferEvent,
	Token as TokenContract,
  } from "../generated/Token/Token"

	import {
		NFTMarketAuction as NFTMarketAuctionContract,
		ReserveAuctionCreated as ReserveAuctionCreatedEvent ,
		ReserveAuctionUpdated as ReserveAuctionUpdatedEvent
		} from "../generated/NFTMarketAuction/NFTMarketAuction"
  
  import {
	Token, User, NFTMarketAuction
  } from '../generated/schema'

	export function handleTransfer(event: TransferEvent): void {
		let token = Token.load(event.params.tokenId.toString());
		if (!token) {
			token = new Token(event.params.tokenId.toString());
			token.creator = event.params.to.toHexString();
			token.tokenID = event.params.tokenId;
		
			let tokenContract = TokenContract.bind(event.address);
			token.contentURI = tokenContract.tokenURI(event.params.tokenId);
			token.tokenIPFSPath = tokenContract.getTokenIPFSPath(event.params.tokenId);
			token.name = tokenContract.name();
			token.createdAtTimestamp = event.block.timestamp;
		}
		token.owner = event.params.to.toHexString();
		token.save();
		 
		let user = User.load(event.params.to.toHexString());
		if (!user) {
			user = new User(event.params.to.toHexString());
			user.save();
		}
	}

	export function handleReserveAuctionCreated(event: ReserveAuctionCreatedEvent): void  {
		let auction = new NFTMarketAuction(event.params.auctionId.toString());
		let token = Token.load(event.params.tokenId.toString());
		if (!token) return;
		auction.token = token.id;
		auction.auctionId = event.params.auctionId;
		auction.seller = event.params.seller.toHexString();
		auction.duration = event.params.duration;
		auction.reservePrice = event.params.reservePrice;
		auction.extensionDuration = event.params.extensionDuration;
		auction.createdAtTimestamp = event.block.timestamp;
		auction.save();
	}
  
  export function handleTokenURIUpdated(event: TokenIPFSPathUpdatedEvent): void {
		let token = Token.load(event.params.tokenId.toString());
		token.tokenIPFSPath = event.params.tokenIPFSPath;
		token.save();
  }
  