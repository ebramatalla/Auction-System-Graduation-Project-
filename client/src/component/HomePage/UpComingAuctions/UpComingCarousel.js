import React from 'react';

import Slider from '../../UI/Carousel/Carousel';
import CountDownTimer from '../../UI/CountDownTimer/CountDownTimer';
import { Link } from 'react-router-dom';

import classes from './UpComingAuctions.module.css';

const UpComingCarousel = ({ UogoingAuctionData: ongoingAuctionData }) => {
	const ShowCarouselItems = ongoingAuctionData.map((Item, index) => {
		return (
			<div className="row ps-5" key={index}>
				<div className="col-md-4 col-lg-4 pe-0 ">
					<div className={classes.itemImage}>
						<img src={Item.item.images[0].url} alt={`itemImage ${index}`} />
						<p
							className={`${classes.UpgoingAuctionBadge} text-center p-1 m-0 fw-bold `}
						>
							{' '}
							UpGoing Auctions{' '}
						</p>
					</div>
				</div>

				<div
					className={`col-md-7 col-lg-7 col-sm-12 px-0 pe-1 ${classes.upGoingAuctionData}`}
				>
					<h2 className="fw-bold text-center pb-1"> {Item.title} </h2>
					{/* start Upgoing Auction details */}
					<div className="ps-3 pt-4">
						<p className={` lead ${classes.ItemDescription} `}>
							{' '}
							{Item.item.shortDescription}{' '}
						</p>
						<div>
							<div>
								<h6 className="fw-bold d-inline-block"> Category : </h6>
								<p className="d-inline-block px-2">
									{' '}
									{Item.category && Item.category.name}{' '}
								</p>
							</div>

							<div>
								<h6 className="fw-bold d-inline-block"> Seller : </h6>
								<Link
									className={`d-inline-block px-2 text-decoration-none fw-bold ${classes.SellerName}`}
									to={`/seller?id=${Item.seller._id}`}
								>
									{' '}
									{Item.seller.name}{' '}
								</Link>
							</div>

							<div className="mt-3">
								<h6 className="fw-bold d-inline-block">
									{' '}
									Start Bid will be :{' '}
								</h6>
								<p className="d-inline-block px-2">
									{' '}
									{Item.minimumBidAllowed}{' '}
								</p>
							</div>
							<div>
								<h6 className="fw-bold d-inline-block">Auction Start in :</h6>
								<div className="d-inline-block px-0">
									{' '}
									{/* {CountDownTimer(new Date(Item.startDate))} */}
									<CountDownTimer status= 'upcoming' AuctionDate = {new Date(Item.startDate)}  />
								</div>
							</div>
						</div>
					</div>
					{/* end Upgoing Auction details */}

					<Link
						className={`${classes.btnViewDetails} btn px-3 py-1 `}
						to={`/auctions?id=${Item._id}`}
					>
						{' '}
						View Auction Details{' '}
					</Link>
				</div>
			</div>
		);
	});

	return (
		<>
			<Slider>{ShowCarouselItems}</Slider>
		</>
	);
};

export default UpComingCarousel;
