import React from 'react';
import { ContentDetailCompartment } from '@redactie/navigation-module';
import './App.scss';


function App() {

	const onFormChange = (e: any) => {
		console.log(e);
	};

  return (
		<div className="u-margin">
			<h6>Navigatie</h6>
			<div>
				<ContentDetailCompartment onChange={onFormChange} />
			</div>
		</div>
  );
}

export default App;
