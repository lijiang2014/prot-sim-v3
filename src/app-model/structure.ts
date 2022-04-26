export const restypes = [
  'A',
  'R',
  'N',
  'D',
  'C',
  'Q',
  'E',
  'G',
  'H',
  'I',
  'L',
  'K',
  'M',
  'F',
  'P',
  'S',
  'T',
  'W',
  'Y',
  'V',
]

export interface colorSeq {
  newseq: string
  count: number
}

export function colorSeq(seq: string): colorSeq {
  const fastaMatch = /\>/
  let seq_arr = seq.split('\n')
  if (fastaMatch.test(seq)) {
    seq_arr = seq_arr.slice(1)
  }
  let newseq = '<div class="sequence">'
  let count = 0
  seq_arr.forEach((m, i) => {
    newseq += '<p>'

    let residues = m.split('')
    residues.forEach((v, i) => {
      if (restypes.indexOf(v.toUpperCase()) === -1) {
        console.log(v + ' ' + i)
        newseq += '<span style="color:red">' + v + '</span>'
        count += 1
      } else {
        newseq += v
      }
    })
    newseq += '</p>'
  })
  newseq += '</div>'
  let res = {
    newseq: newseq,
    count: count,
  }
  return res
}

export interface baseRequest {
  proj_name: string;
  email?: string;
  platform?: string[],
}

export enum RoseTTAFoldMode {
  pyrosetta = 'pyrosetta' 
}

export interface structurePredictRequest extends baseRequest {
  // proj_name: string
  // email?: string
  // platform: string[]
  protein_seq: string
  RoseTTAFold_mode: RoseTTAFoldMode
}