import React from 'react';
if(process.env.WEBPACK) require('./index.scss');
class HomePage extends React.Component {
    render() {
        return (
            <div>
                <h1>HOMEPAGE</h1>
            </div>
        );
    }
}

export default HomePage;
