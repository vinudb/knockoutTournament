import React from 'react';
import Modal from 'react-modal';

class GameInProgressModal extends React.Component{
    render(){
        return(
            <Modal
                isOpen={this.props.isModalOpen}
                contentLabel="New Level Started"
                closeTimeoutMS={200}
                className="modal"
                closeTimeoutMS={200}
            >
            <h3 className="modal__title">Knockout Tournament</h3>
            <h3 className="modal__title">{this.props.content}</h3>
            </Modal>                
        );
    }
}

export default GameInProgressModal;