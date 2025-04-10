import './App.css';
import { useState } from 'react';

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
    {props.body}
    </article>
  );
}

function Header(props) {
  return (
    <header>
      <h1>
        <a href="/" onClick={(event) => {
          event.preventDefault();
          props.onChangeMode();
        }}>
          {props.title}
        </a>
      </h1>
    </header>
  );
}

function Nav(props) {
  const lis = [];
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(
      <li key={t.id}>
        <a
          id={t.id}
          href={'/read/' + t.id}
          onClick={(event) => {
            event.preventDefault();
            props.onChangeMode(Number(event.target.id));
          }}
        >
          {t.title}
        </a>
      </li>
    );
  }
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title" /></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><input type="submit" value="Create" /></p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        props.onUpdate(title, body);
      }}>
        <p>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </p>
        <p>
          <textarea
            name="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </p>
        <p><input type="submit" value="Update" /></p>
      </form>
    </article>
  );
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is ....' },
    { id: 2, title: 'css', body: 'css is ....' },
    { id: 3, title: 'javascript', body: 'javascript is ....' }
  ]);

  let content = null;
  let contextControl = null;

  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WeB" />;
  } else if (mode === 'READ') {
    let title = null;
    let body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body} />;
    contextControl = (
      <>
        <li>
          <a href={"/update/" + id} onClick={(event) => {
            event.preventDefault();
            setMode('UPDATE');
          }}>Update</a>
        </li>
        <li>
          <input type="button" value="Delete" onClick={() => {
            const newTopics = topics.filter(topic => topic.id !== id);
            setTopics(newTopics);
            setMode('WELCOME');
          }} />
        </li>
      </>
    );
  } else if (mode === 'CREATE') {
    content = <Create onCreate={(title, body) => {
      const newTopic = { id: nextId, title, body };
      setTopics([...topics, newTopic]);
      setNextId(nextId + 1);
      setMode('READ');
      setId(nextId);
    }} />;
  } else if (mode === 'UPDATE') {
    let title = null, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(newTitle, newBody) => {
      const updatedTopic = { id, title: newTitle, body: newBody };
      const newTopics = topics.map(topic =>
        topic.id === id ? updatedTopic : topic
      );
      setTopics(newTopics);
      setMode('READ');
    }} />;
  }

  return (
    <div>
      <Header title="REACT" onChangeMode={() => {
        setMode('WELCOME');
      }} />
      <Nav topics={topics} onChangeMode={(_id) => {
        setMode('READ');
        setId(_id);
      }} />
      {content}
      <ul>
        <li><a href="/create" onClick={(event) => {
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;

