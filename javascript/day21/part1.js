const fs = require('fs')

let input = fs.readFileSync('input', 'utf-8').trim()
class IntCode {
    constructor(memory, ip=0){
        this.memory = [...memory]
        this._memory_backup = [...memory]
        this.ip = ip
        this.rel_base = 0
        this.halt = false
        this.pause = false
        this.inputs = []
        this.outputs = []
        this.OPCODES = {99: 0, 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 1}

    }

    reset(){
        this.ip = 0
        this.rel_base = 0
        this.halt = false
        this.pause = false
        this.inputs = []
        this.outputs = []
        this.memory = [...this._memory_backup]
        this.OPCODES = {99: 0, 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 1}
    }

    input(inp){
        this.inputs.push(inp)
    }

    output(){
        return this.outputs.shift()
    }

    step(){
        if(this.halt) return
        if(this.pause) return
        let fop = this.memory[this.ip]
        let op = fop%100
        let modes = Math.floor(fop/100)
        let m1 = modes%10
        let m2 = Math.floor(modes/10)%10
        let m3 = Math.floor(modes/100)%10

        let first, second, third
        switch(m1){
            case 0: first = this.memory[this.ip+1]; break;
            case 1: first = this.ip+1; break;
            case 2: first = this.memory[this.ip+1]+this.rel_base; break;
        }
        switch(m2){
            case 0: second = this.memory[this.ip+2]; break;
            case 1: second = this.ip+2; break;
            case 2: second = this.memory[this.ip+2]+this.rel_base; break;
        }
        switch(m3){
            case 0: third = this.memory[this.ip+3]; break;
            case 1: third = this.ip+3; break;
            case 2: third = this.memory[this.ip+3]+this.rel_base; break;
        }

        if(this.OPCODES[op] >= 1 && this.memory[first] == undefined)
            this.memory[first] = 0
        if(this.OPCODES[op] >= 2 && this.memory[second] == undefined)
            this.memory[second] = 0
        if(this.OPCODES[op] >= 3 && this.memory[third] == undefined)
            this.memory[third] = 0

        this.ip += this.OPCODES[op]+1
        if(op === 99){
            this.halt = true
        }else if(op == 1){
            this.memory[third] = this.memory[first]+this.memory[second]
        }else if(op == 2){
            this.memory[third] = this.memory[first]*this.memory[second]
        }else if(op == 3){
            this.memory[first] = this.inputs.shift()
        }else if(op == 4){
//            process.stdout.write(String.fromCharCode(this.memory[first]))
            console.log(this.memory[first])
            this.outputs.push(this.memory[first])
        }else if(op == 5){
            this.ip = this.memory[first]!=0?this.memory[second]:this.ip
        }else if(op == 6){
            this.ip = this.memory[first]==0?this.memory[second]:this.ip
        }else if(op == 7){
            this.memory[third] = this.memory[first] < this.memory[second]?1:0
        }else if(op == 8){
            this.memory[third] = this.memory[first] == this.memory[second]?1:0
        }else if(op == 9){
            this.rel_base += this.memory[first]
        }else{
            console.log('UNKNOWN OP: ' + fop + ' at ' + this.ip)
            this.halt = true
        }
    }

    run(){
        this.pause = false
        while(!this.halt && !this.pause){
            this.step()
        }
    }
}

let computer = new IntCode(input.split(',').map(Number))
"NOT A T\nNOT T T\nAND B T\nAND C T\nNOT T J\nAND D J\nWALK\n".split('').forEach(c=>computer.input(c.charCodeAt(0)))

while(!computer.halt){
    computer.step()
}
console.log(computer.outputs.reduce((a, b)=>a+b))
