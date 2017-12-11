import IntercambioBancarioFileAbstract from './IntercambioBancarioFileAbstract';
import Picture from './Format/Picture';
import Retorno from './Model/Retorno';
import Linha from './Model/Linha';

module.exports = class IntercambioBancarioRetornoFileAbstract extends IntercambioBancarioFileAbstract {
    static get REGISTRO_HEADER_ARQUIVO() {
        return 0;
    }

    static get REGISTRO_HEADER_LOTE() {
        return 1;
    }

    static get REGISTRO_DETALHES() {
        return 3;
    }

    static get REGISTRO_TRAILER_ARQUIVO() {
        return 9;
    }

    constructor(layout, linhas) {
        super();
        this._layout = layout;
        this._linhas = [];
        this._totalLotes = 0;
        linhas.split("\n").forEach((linha) => {
            if (linha === '') {
                return;
            }

            this._linhas.push(linha);
        });

        if (!this._linhas) {
            throw new Error(`O arquivo de retorno passado é inválido`);
        }

        this._calculaTotalLotes();
        this._model = new Retorno();
    }

    _calculaTotalLotes() {
        this._totalLotes = 1;
        const layout = this._layout.getLayout();
        const linhaTrailerArquivoStr = this._linhas[this._linhas.length - 1];

        let linha = new Linha(linhaTrailerArquivoStr, this._layout, 'retorno');

        if (layout === '240') {
            const definicao = {pos: [18,23], picture: '9(6)'};

            this._totalLotes = +(linha.obterValorCampo(definicao));
        } else {
            this._totalLotes = 1;
        }

        return this._totalLotes;
    }

    getTotalLotes() {
        return this._totalLotes;
    }


};