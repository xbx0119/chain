/**
 * 共识类
 */

class CommonConsensus {
    constructor(name) {
        this.name = name;

        this.fromNet = {
            archonDeal: this.archonDeal,
            senateDeal: this.senateDeal,
            citizenDeal: this.senateDeal,
            unSupportDeal: this.unSupportDeal
        }

        this.fromDigital = {
            archonDeal: this.archonDeal,
            senateDeal: this.senateDeal,
            citizenDeal: this.senateDeal,
            unSupportDeal: this.unSupportDeal
        }
    }

    archonDeal() {
        throw "默认方法，请在实例中覆盖";
    }

    senateDeal() {
        throw "默认方法，请在实例中覆盖";
    }

    citizenDeal() {
        throw "默认方法，请在实例中覆盖";
    }

    unSupportDeal(data) {
        console.log("未知节点或操作 %s", data);
    }
}

export default CommonConsensus;