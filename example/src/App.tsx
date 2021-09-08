import React, {useState} from 'react';
import {useParser, useNLUDB, useEmbeddingIndex} from '@nludb/react-hooks';
import { EmbeddingModel } from '@nludb/client'

import './App.css';

function Hit({hit}) {
  return <tr>
    <td>{hit.score}</td>
    <td>{hit.value}</td>
  </tr>
}

export interface ISearchBar {
  onSubmit: (s: string) => void;
  buttonText: string;
  placeholder: string
}

const SearchBar = (params: ISearchBar) => {
  const [query, setQuery] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    params.onSubmit(query)
  };

  return (
    <form autoComplete="off" onSubmit={onSubmit}>
      <input
        type="text"
        id="header-search"
        placeholder={params.placeholder}
        value={query}
        onInput={(e) => setQuery(e.target.value)}
      />
      <button type="submit">{params.buttonText}</button>
    </form>
  );
}

function IndexDemo() {
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.nludb.com/api/v1/');
  const [k, setK] = useState(1);

  const [nludb, nludbError] = useNLUDB({
    apiKey:apiKey,
    apiEndpoint: apiEndpoint,
    verbose: true
  })

  const [{results, isSearching, error: indexError}, {reset, search, insert}] = useEmbeddingIndex({
    nludb,
    name: "Klaviyo Demo for Eric",
    model: EmbeddingModel.QA,
    upsert: true,
    verbose: true
  })


  const [{results: parseResults, isParsing, error: parseError}, {reset: resetParse, parse}] = useParser({
    nludb,
    includeTokens: false,
    includeEntities: true
  })

  const doInsert = (item: string) => {
    console.log("doInsert", item);
    insert({value: item, upsert: true})
  }

  const doSearch = (query: string) => {
    console.log("doSearch", query);
    search({query})
  }

  const doParse = (query: string) => {
    console.log("doParse", query);
    parse({docs: [query]})
  }

  return (
    <div className="App">
      <p>This is a demonstration of the <code>useEmbeddingIndex</code> hook:</p>
      <SearchBar onSubmit={setApiKey} placeholder="Find at www.nludb.com" buttonText="Set API Key" />
      <SearchBar onSubmit={setApiEndpoint} placeholder="https://api.nludb.com/api/v1/" buttonText="Set API Endpoint" />
      <SearchBar onSubmit={(k) => {setK(parseInt(k))}} placeholder="Enter an integer" buttonText="Set Desired Result Count" />
      <SearchBar onSubmit={doInsert} placeholder="New Item" buttonText="Insert" />
      <SearchBar onSubmit={doSearch} placeholder="Enter Query" buttonText="Search" />
      <h2>Results:</h2>
      <ul>
        <li>API Key: {JSON.stringify(apiKey)}</li>
        <li>k: {JSON.stringify(k)}</li>
        <li>Error: {JSON.stringify(indexError)}</li>
        <li>isSearching: {JSON.stringify(isSearching)}</li>
        <li>Search Results:
          <table>
            {results?.hits?.map(hit => <Hit hit={hit} /> ) }
          </table>
        </li>
      </ul>

      <p>This is a demonstration of the <code>useParser</code> hook:</p>
      <SearchBar onSubmit={doParse} placeholder="New Item" buttonText="Parse" />
      <h2>Results:</h2>
      <ul>
        <li>isParsing: {JSON.stringify(isParsing)}</li>
        <li>Parse Results:
          <pre><code>{JSON.stringify(parseResults, undefined, 2)}</code></pre>
        </li>
      </ul>

    </div>
  );
}

export default IndexDemo;
