import React, { useState } from 'react';

import classes from './ChatContent.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

import moment from 'moment';

function ChatContentUi({ Message, sendMessage, className, getChatWithEmail , noChatHistory}) {
	const email = useSelector(store => store.AuthData.email);
	const [MessageValue, setMessageValue] = useState('');
	let isShownEmailAddress = true

	const getTime = time => {
		const Time = moment(time).format('LT');
		return Time;
	};

	return (
		<div className={` ${classes.ChatContent} ${className ? className : ''}`}>
			<>
				<input
					type="text"
					placeholder="Type your message"
					className={`${classes.ChatContentInput}  form-control `}
					onChange={e => setMessageValue(e.target.value)}
				/>
				<button
					className={`${classes.ChatContentButton} btn btn-secondary`}
					type="button"
					id="inputGroupFileAddon04"
				>
					<FontAwesomeIcon
						icon={faPaperPlane}
						onClick={() => (	<>

							{sendMessage(MessageValue, getChatWithEmail)}
							{noChatHistory && window.location.reload()}
							</>
						)}
					/>
				</button>
			</>

			{/* start chat content  */}
			<div className={` ${className ? className : ''} ${classes.Messages}`}>
				{Message && Message.length !== 0 ? (
					Message.map((message, index) => (
						<React.Fragment key={index}>
							<div
								className={
									message.senderEmail === email
										? classes.messageFromMe
										// : (((message.senderEmail === getChatWithEmail) || getChatWithEmail === 'Support@email.com') ? classes.messageFromOther : 'd-none')
										: ((message.senderEmail === getChatWithEmail || getChatWithEmail === 'Support@email.com') ? classes.messageFromOther : 'd-none')

									}
							>
								<p className={classes.Email}>
									{message.senderEmail.substring(0, 1).toUpperCase()}{' '}
								</p>
								<div className={classes.MessageContent}>
									<p> {message.message} </p>
									{isShownEmailAddress && (
										<span
											className={`${classes.isShownEmailAddress} ${
												message.senderEmail === email
													? 'text-end'
													: 'text-start'
											} `}
										>
											{' '}
											{message.senderEmail}{' '}
										</span>
									)}
								</div>
							</div>
							<p
								className={`${classes.MessageTime} ${
									message.senderEmail === email
									? 'text-end'
									: ((message.senderEmail === getChatWithEmail || getChatWithEmail === 'Support@email.com') ? classes.messageFromOther : 'd-none')
							}
								}`}
							>
								{getTime(message.sentAt)}
							</p>
						</React.Fragment>
					))
				) : (
					<p className="text-center text-danger pt-2"> No messages Now </p>
				)}
			</div>
			{/* end chat content  */}
		</div>
	);
}

export default ChatContentUi;
