
class Format{
    static formatDate(date){
        const months = [
            'jan.', 'fev.', 'mar.', 'abr.',
            'mai.', 'jun.', 'jul.', 'aug.',
            'set.', 'out.', 'nov.', 'dez.'
        ]

        const splitted = date.split('-');

        const formatted = `${splitted[2]} ${months[parseInt(splitted[1]) - 1]} ${splitted[0]}`
        return formatted;
    }

    static formatTime(time){
        const splitted = time.split(':');
        const formatted = `${splitted[0]}h${splitted[1]}`
    
        return formatted;
    }

}

export default Format;