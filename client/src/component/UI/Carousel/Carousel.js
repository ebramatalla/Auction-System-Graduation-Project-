import React from 'react';
import { Carousel } from 'react-bootstrap';
import classes from './Carousel.module.css';

const Slider = props => {
	const ShowCarouselItems =
		props.children && !props.children.length ? (
			<Carousel.Item interval={200}>{props.children}</Carousel.Item>
		) : (
			props.children.map((item, index) => (
				<Carousel.Item key={index}>{item}</Carousel.Item>
			))
		);

	return (
		<>
			<Carousel
				fade
				className={`${classes.Carousel} m-auto `}
				prevIcon={
					<span className={`carousel-control-prev-icon ${classes['prev']} `}>
						{' '}
					</span>
				}
				nextIcon={
					<span className={`carousel-control-next-icon ${classes['next']} `}>
						{' '}
					</span>
				}
			>
				{ShowCarouselItems}
			</Carousel>
		</>
	);
};

export default Slider;
