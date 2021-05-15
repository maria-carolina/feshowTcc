
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

    static formatDatetoDMY(date){
        const splitted = date.split('-');

        const formatted = `${splitted[2]}/${splitted[1]}/${splitted[0]}`
        return formatted;
    }

    static formatTime(time){
        const splitted = time.split(':');
        const formatted = `${splitted[0]}h${splitted[1]}`
    
        return formatted;
    }

    static unformatTime(time){
        const splitted = time.split('h');
        const formatted = `${splitted[0]}:${splitted[1]}`
        return formatted;
    }

    static getWeekDay(number){
        const weekDays = [
            'Domingo', 'Segunda-Feira', 'Terça-Feira',
            'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira',
            'Sábado'
        ]

        return weekDays[number - 1];
    }

}

export default Format;