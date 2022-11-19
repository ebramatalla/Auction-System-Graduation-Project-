import {
	faDollarSign,
	faUsers,
	faHeartCircleBolt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import classes from './Services.module.css';

function Services() {
	const servicesData = [
		{
			icon: faHeartCircleBolt,
			heading: 'Convenience',
			text:
				'Online auctions provide every individual with the convenience they are looking for. Buyers can take part in multiple auctions conducted in different places around the world on the same day. You can also buy your favorite items from the same place you bid on.',
		},
		{
			icon: faDollarSign,
			heading: 'Cost-saving',
			text:
				'As every item is pictured, sold, and picked up from the same location, there is no need to keep an inventory of all the items. You will be able to save a huge amount of money that you might have to spend on the security of the items, shipping the items, or inventorying the items.',
		},
		{
			icon: faUsers,
			heading: 'More Bidders',
			text:
				'Online auctions make it easy to reach bidders from around the world. There are plenty of younger bidders, people who only want one item, or even stay-at-home bidders who take part in online auctions. As there are many buyers in an online auction, you can expect better results for the items you put up.',
		},
	];

	const showServiceCard = servicesData.map((data, index) => (
		<Col lg={4} key={index}>
			<Card className={classes._card} key={index}>
				<Card.Body>
					<Card.Title>
						<FontAwesomeIcon icon={data.icon} className={classes._cardIcon} />
						<h3 className="text-center mb-3 fw-bold"> {data.heading} </h3>
					</Card.Title>
					<Card.Text className={classes._cardText}>{data.text}</Card.Text>
				</Card.Body>
			</Card>
		</Col>
	));
	return (
		<>
			<div className={classes.ServiceCard}>
				<Row>{showServiceCard}</Row>
			</div>
		</>
	);
}

export default Services;
