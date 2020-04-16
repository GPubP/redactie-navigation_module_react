import React from 'react';
import { Card, CardBody } from '@acpaas-ui/react-components';
import { ContentDetailCompartment } from '@redactie/navigation-module';
import './App.scss';


function App() {

	const onFormChange = (e: any) => {
		console.log(e);
	};

  return (
		<div>
			<div className="u-margin">
				<h2 className="u-margin-bottom">Content detail compartment</h2>
				<Card>
					<CardBody>
						<ContentDetailCompartment onChange={onFormChange} />
					</CardBody>
				</Card>
			</div>
		</div>
  );
}

export default App;
