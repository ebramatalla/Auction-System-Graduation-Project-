import React, { useEffect, useState } from 'react';

import io from 'socket.io-client';

import PageContent from '../DashboardLayout/Pagecontant/pageContent';
import classes from './Chat.module.css';
import { Col, Row } from 'react-bootstrap';

import ChatHistory from './ChatHistory';
import scrollbarStyle from '../../UI/ScrollBar.module.css';
import ChatContent from './ChatContent';
import { useSelector } from 'react-redux';
import ModalUi from '../Modal/modal';
import { useNavigate } from 'react-router-dom';

const Chat = props => {
	const idToken = useSelector(store => store.AuthData.idToken);
	const isLoggedIn = useSelector(store => store.AuthData.isLoggedIn);

	const [chatWith, setChatWith] = useState('');
	const [ShowModal, setShowModal] = useState(true);

	const [showChatHistory, setShowChatHistory] = useState(true);
	const [noChatHistory , setNoChatHistory] = useState(false)
	const [newMessage , setNewMessage] = useState(null)

	const [socket , setSocket] = useState(null)
	const redirectUserToHomePage = useNavigate();
	useEffect(()=>{
		setSocket(
			io('http://localhost:8000/chat', {
			extraHeaders: {
				authorization: `Bearer ${idToken}`
			}})
		)
	},[chatWith, showChatHistory])

	const getChatWith = email => {
		setChatWith(email);
	};
	const ShowChatHistoryHandler = value => {
		setShowChatHistory(value);
	};

	return (
		<>
			{isLoggedIn ? (
				<PageContent className={`${classes.PageContentClasses}`}>
					<Row className="h-100 m-0">
						<Col
							lg={4}
							md={6}
							sm={12}
							className={`${classes.chatList} ${scrollbarStyle.scrollbar}`}
						>
							<ChatHistory
								chatWith={getChatWith}
								className={` ${
									showChatHistory ? 'd-block' : 'd-none d-md-block'
								} `}
								onShow={ShowChatHistoryHandler}
								getChatHistoryWith={props.SellerEmail && props.SellerEmail}
								noChatHistory = {(value)=> setNoChatHistory(value)}
								newMessage = {newMessage}

							/>
						</Col>

						<Col
							lg={8}
							md={6}
							sm={12}
							className={`${classes.ChatContent} ${scrollbarStyle.scrollbar} p-0 `}
						>
							<button
								className={`btn bg-danger text-light position-fixed ${
									!showChatHistory
										? 'd-block d-xs-block d-sm-block d-md-none'
										: 'd-none'
								}	`}
								onClick={() => setShowChatHistory(true)}
							>
								{' '}
								X
							</button>
							<ChatContent
								socket={socket}
								getChatWithEmail={chatWith && chatWith}
								noChatHistory = {noChatHistory}
								newMessage = {(value) => setNewMessage(value) }
								className={` ${
									chatWith && !showChatHistory
										? 'd-block d-xs-block'
										: 'd-none d-md-block'
								} `}
							/>

						</Col>
					</Row>
				</PageContent>
			) : (
				<ModalUi
					show={ShowModal}
					onHide={() => setShowModal(false)}
					title="Please Logged in First, before Chatting  "
					btnName={'Log in'}
					btnHandler={() => redirectUserToHomePage('/login')}
				/>
			)}
		</>
	);
};

export default Chat;
