
class MainFrame extends Component{
    constructor(props){
        super(props)
        console.log(`MAINFRAME CLASS:\n\
            ID: ${node?.id}
            NAME: ${node?.name}\n
            TYPE: ${node?.type}\n
            PID: ${node?.parrent_id}\n
            URL: ${node?.url}\n,
            DESCRIPTION: ${node?.description}\n
            POSITION: ${node?.element_position}
            `
        )
    }
}