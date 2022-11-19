import React from 'react';
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';

import './modal.css';

const ModalUi = props => {
	const btnHandler = () => {
		if (props.Id) {
			props.btnHandler(props.Id);
		}
		if (!props.Id) {
			props.btnHandler();
		}
	};
	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			className={props.className ? props.className : ''}
		>
			<Modal.Header closeButton>
				<Modal.Title
					id="contained-modal-title-vcenter"
					className={`${props.body && !props.hideBorder ? 'hasBorder' : ''} ${
						props.hideBorder ? 'hideBorder' : ''
					}`}
				>
					{props.title && props.title}
				</Modal.Title>
				<button
					className="btn bg-danger align-items-end btn-close-modal"
					onClick={props.onHide}
				>
					{' '}
					X{' '}
				</button>
			</Modal.Header>

			{/* start Modal Body */}
			{props.body && <Modal.Body> {props.body} </Modal.Body>}
			{props.data && (
				<Modal.Body>
					{props.data && props.data.joinedAuctions && (
						<DataTable
							columns={props.columns}
							data={props.data.joinedAuctions}
							// subHeader
							// subHeaderComponent={filterFun}
							theme="dark"
							pagination
						/>
					)}
				</Modal.Body>
			)}
			{/* end Modal Body */}

			<Modal.Footer
				className={props.btnFooterStyle ? props.btnFooterStyle : ''}
			>
				{/* btn show only when delete */}
				{props.btnName && (
					<button
						onClick={btnHandler}
						type="button"
						className="btn-success btn fw-bold col-sm-12 fs-6"
					>
						{props.btnName}
					</button>
				)}
				<button
					onClick={props.onHide}
					className="bg-danger text-light fw-bold btn "
				>
					Close
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalUi;
