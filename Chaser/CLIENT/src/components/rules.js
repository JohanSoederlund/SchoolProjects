import React from 'react';

//import rulesAsset from '../assets/rules';
import { Snackbar, IconButton } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Close } from 'material-ui-icons';

export default class Rules extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rules: 'Chaser spelregler,  v1.0'+
            '\n\nChaser spelas mellan två spelare där den ena har rollen “chaser” och den andra “runaway”. Vilken roll en spelare har tilldelas vid matchningen när en spelomgång skapas. '+
            '\n\nChaser tilldelas ett antal spelpjäser representerande detektiver, kameraövervakning och vägspärrar vid spelets start. Runaway tilldelas spelpjäsen rymling.'+
            '\n\nSpelet går ut på att chaser ska försöka fånga in rymlingen genom att placera en detektiv på samma position som rymlingen står. Om rymlingen inte blir infångad inom spelomgångens maximala antal spelomgångar vinner runaway.'+
            '\n\nGrundinställningar för spelet är:'+
            '\n\nSpelbordet: 12*12 spelrutor (positioner) som spelpjäserna kan placeras på.'+
            '\n\nSpelpjäser: 5 detektiver, 4 kameraövervakning, 1 vägspärr, 1 rymling'+
            '\n\nDetektiv representeras med ett ”D”, vägspärr med ett ”B” och rymling med ett ”R” på spelbordet. Kameraövervakning representera med att spelrutan färgas gul. '+
            '\n\nEn spelomgång omfattar 10 spelrundor där chaser och runaway gör sina förflyttningar.'+
            '\n\nVarje detektiv och rymling kan flyttas maximalt två steg varje spelrunda. Chaser har totalt 6 förflyttningar av detektiver att tillgå per runda.'+
            '\n\nVarje ruta kan bara husera en spelpjäs bortsett från kameraövervakning som även kan ha en annan spelpjäs placerad på sig. '+
            '\n\nSpelet startar med spelrunda 0 där chaser placerar ut alla sina detektiver. Chaser lämnar över spelturen till runaway som placerar ut sin rymling. '+
            '\n\nDessa spelpjäser är efter utplacering synliga för bägge spelarna. Detektiverna är synliga för bägge spelarna hela tiden. Rymlingen är synlig för chaser efter utplacering, därefter vid spelomgång 3,6,9'+
            '\n\nSpelet fortsätter efter utplaceringsrundan med att chaser flyttar sina detektiver och eventuellt flyttar ut sina kameraövervakningar och vägspärrar på spelbordet. Väl utplacerad kan kameraövervakningar och vägspärrar inte senare flyttas. Därefter är det runanaways tur att flytta sin rymling. Efter denna spelrunda 1 är alltså inte rymlingen inte synlig för chaser men blir det alltså igen med jämna mellanrum.'+
            '\n\nEn vägspärr blockerar vägen och kan inte passeras, en annan spelpjäs kan alltså inte placeras på samma position. Om rymlingen stannar på en position med kameraövervakning blir rymlingen synlig för chaser oavsett spelrunda.',
            snackState: true,
            showComponent: false,
        }
        this.showRules = this.showRules.bind(this);
    }

    showRules() {
        this.setState({
            showComponent: true,
            snackState: true
          });
    }

    render() {
        return (
            <div>
                <button onClick={() => this.showRules()}>Regler</button>
                {this.state.showComponent ?
                    <MuiThemeProvider>
                        <Snackbar className='snackbar'
                            bodyStyle={{ height: 'auto', lineHeight: '18px', padding: 24, whiteSpace: 'pre-line' }}
                            message={this.state.rules}
                            autoHideDuration={60000}
                            open={this.state.snackState}
                            onClose={() => this.setState({ snackState: false })}
                            action={[
                                <IconButton className='icon-button'
                                    key='close'
                                    aria-label='Stäng'
                                    onClick={() => this.setState({ snackState: false })}
                                >
                                    <Close className='close'
                                        color="white"
                                    />
                                </IconButton>,
                            ]}
                        />
                    </MuiThemeProvider> :
                    null
                }
            </div>
        );
    }
}
