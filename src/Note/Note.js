import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import ApiContext from '../ApiContext'

export default class Note extends Component {
  static contextType = ApiContext
  static defaultProps = {
    onDeleteNote: () => {}
  }

  handleClickDelete = (event) => {
    event.preventDefault()
    const noteId = this.props.id;
    const NOTES_URL = 'http://localhost:9090/notes'
    fetch(`${NOTES_URL}/${noteId}`, {method: 'DELETE', headers: {'content-type': 'application/json'}})
      .then(resource => {
        if(!resource.ok) {
          return resource.json().then(e => Promise.reject(e))
        }
        return resource.json()
      })
      .then(() => {
        this.context.deleteNote(noteId)
        this.props.onDeleteNote(noteId)
      })
      .catch(error => {
        console.log({error})
      })
  }
  
  render() {
    const {id, name, modified} = this.props
    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${id}`}>
            {name}
          </Link>
        </h2>
        <button className='Note__delete' type='button' onClick={this.handleClickDelete}>
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
