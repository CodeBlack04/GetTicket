// global css must be imported to custom app file unless next will
// run app file automatically which doesn't incude the global css.
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentuser }) => {
    
    return <div>
                <Header currentuser={currentuser}/>
                <div className='container'>
                <Component currentuser= {currentuser} {...pageProps} />
                </div>
            </div>
};

AppComponent.getInitialProps = async (appContext) => {   //we can make ({ ctx }) too.
    //console.log(Object.keys(appContext));
    //console.log(appContext)
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    //console.log(response)
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentuser);
    }

    //console.log(pageProps)
    //console.log(response.data);
    return {
        pageProps,
        currentuser: data.currentuser
    }

}
export default AppComponent