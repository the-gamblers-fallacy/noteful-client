import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import ApiContext from '../ApiContext';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        const FOLDER_URL = 'http://localhost:9090/folders';
        const NOTES_URL = 'http://localhost:9090/notes'

        fetch(FOLDER_URL)
            .then(response => response.ok ? response.json() : new Error('You effed everything in the a!'))
            .then(response => {
                this.setState({folders: response})
            })
            .catch(e => console.log(e.message))
        fetch(NOTES_URL)
            .then(response => response.ok ? response.json() : new Error('Oh sweet geebus ur not gettin the notes!'))
            .then(response => {
                this.setState({notes: response})
            })
            .catch(e => console.log(e.message))
    }

    deleteNote = noteId => {
        const newNotes = this.state.notes.filter(note => note.id !== noteId);
        this.setState({
            notes: newNotes
        })
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    component={NotePageNav}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    component={NotePageMain}
                />
            </>
        );
    }

    render() {
        const contextValue ={
            deleteNote: this.deleteNote,
            folders: this.state.folders,
            notes: this.state.notes
        }
        return (
            <ApiContext.Provider value={contextValue}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </ApiContext.Provider>
        );
    }
}

export default App;
