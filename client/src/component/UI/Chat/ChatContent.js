import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ChatContentUi from './ChatContentUi';

function ChatContent({ socket, getChatWithEmail, className , noChatHistory , newMessage}) {
	const role = useSelector(store => store.AuthData.role);

	const [Message, setMessage] = useState([]);

	const sendMessage = (message, Email) => {
		if (message) {
			if (role !== 'employee') {
				// send new Message to support
				if(Email === 'Support@email.com'){
					socket.emit('new-message-to-Support', {
						message: message,
					});
				}
				else {socket.emit('new-message-to-server', {
					message: message,
					receiverEmail: Email,
				});}
			}

			// to send message from support to client
			else{
				socket.emit('new-message-From-Support', {
					message: message,
					receiverEmail: Email,
				});
			}

		}
	};

	// start get chat history when reload
	useEffect(() => {
		if(socket) {
			socket.on('chat-history-to-client', data => {
				setMessage(data && [...data]);
			});

			if (getChatWithEmail && role!== 'employee') {
				socket.emit('get-chat-history', {
					with: getChatWithEmail,
				});
			}
			// get chat history with this email
			if (role === 'employee') {
				socket.emit('get-chat-history', {
					with: getChatWithEmail,
				});
			}
		}

	}, [getChatWithEmail , socket]);
	// end get chat history when reload

	useEffect(() => {
		// start get all chats to [seller or buyer]
		if(socket) {

		socket.on('new-message-to-client', data => {
			setMessage(prevState =>
			prevState && prevState.length > 0 ? [...prevState, data] : [data],
		);

		});
		// get all chat history
		socket.on('chat-history-to-client', data => {
			setMessage(data && [...data]);
		})

	}

	}, [socket , role]);

	useEffect(()=>{
		if(socket) {

		if(role === 'buyer' || role === 'seller'){
			socket.on('new-message-to-Employee', data => {
					setMessage(prevState => prevState && prevState.length > 0 ? [...prevState, data] : [data]);

			});
			socket.on('new-message-From-Employee', data => {
					setMessage(prevState => prevState && prevState.length > 0 ? [...prevState, data] : [data]);
			});
		}

		if(role === 'employee'){

			socket.on('new-message-From-Employee', data => {
					setMessage(prevState => prevState && prevState.length > 0 ? [...prevState, data] : [data]);
			});
			socket.on('new-message-to-Employee', data => {
					setMessage(prevState => prevState && prevState.length > 0 ?
						(data.message !== prevState[prevState.length -1].message  ? [...prevState, data] : [...prevState]) : [data]);
					});

		}
		}
	},[socket , role])


	useEffect(()=>{
		if(Message && Message.length > 0){
			newMessage({email : Message[Message.length - 1].senderEmail , lastMessage : Message[Message.length - 1].message , lastMessageTime : moment(Message[Message.length - 1].sentAt).format('LT')})
		}
	}, [Message])


	return (
		<>
		{((getChatWithEmail && Message) || noChatHistory ) ?
			<ChatContentUi
				Message={Message && Message}
				sendMessage={sendMessage}
				className={className}
				getChatWithEmail={getChatWithEmail}
				noChatHistory = {noChatHistory}
			/>
			: <h5 className='text-danger fw-bold text-center'> Start Chat Now From Chat History <span role="img" aria-label="no-chat"> 💬👈 </span> </h5>
		}
	</>
	);
}

export default ChatContent;
