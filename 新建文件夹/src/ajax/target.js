
import axios from 'axios'

export default {
  getTargets (cb) {
    axios({
      method: 'GET',
      url: '/v1/ind'
    }).then(res => {
      cb(res.data)
    })
  },
  getScoreRange (cb, id) {
    axios({
      method: 'GET',
      url: '/v1/indrel/scorerange',
      params: {
        indId: id
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getScoreTypeB (cb, id) {
    axios({
      method: 'GET',
      url: '/v1/indrel/typeb',
      params: {
        indId: id
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getIndParams (cb) {
    axios({
      method: 'GET',
      url: '/v1/indrel'
    }).then(res => {
      cb(res.data)
    })
  },
  create (cb, payload) {
    const params = new URLSearchParams()
    params.append('pid', payload.pid)
    params.append('name', payload.name)
    params.append('remark', payload.remark)
    params.append('indDef', payload.ind_def)
    params.append('indSource', payload.ind_source)
    params.append('indTypeId', payload.ind_type_id)
    params.append('unitId', payload.unit.id)
    params.append('orderNo', payload.order_no)
    params.append('isLeaf', payload.is_leaf)
    params.append('hasDetail', payload.has_detail)
    params.append('detailTemplateId', payload.detail_template_id)
    params.append('submitTypeId', payload.submit_type_id)
    params.append('scoreRuleId', payload.score_rule_id)
    params.append('fscoreTypeId', payload.fscore_type_id)
    params.append('dedupeRuleId', payload.dedupe_rule_id)
    params.append('checkRuleId', payload.check_rule_id)
    params.append('typeBData', payload.typeB_data)
    params.append('indRangeScore', payload.ind_range)
    params.append('formula', payload.formula)
    params.append('formulaInd', payload.formula_ind)
    params.append('decimals', payload.decimals)
    params.append('isCalc', payload.is_calc)
    axios({
      method: 'POST',
      url: '/v1/ind',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  update (cb, payload) {
    const params = new URLSearchParams()
    params.append('indId', payload.id)
    params.append('pid', payload.pid)
    params.append('name', payload.name)
    params.append('remark', payload.remark)
    params.append('indDef', payload.ind_def)
    params.append('indSource', payload.ind_source)
    params.append('indTypeId', payload.ind_type_id)
    params.append('unitId', payload.unit.id)
    params.append('orderNo', payload.order_no)
    params.append('isLeaf', payload.is_leaf)
    params.append('hasDetail', payload.has_detail)
    params.append('detailTemplateId', payload.detail_template_id)
    params.append('submitTypeId', payload.submit_type_id)
    params.append('scoreRuleId', payload.score_rule_id)
    params.append('fscoreTypeId', payload.fscore_type_id)
    params.append('dedupeRuleId', payload.dedupe_rule_id)
    params.append('checkRuleId', payload.check_rule_id)
    params.append('typeBData', payload.typeB_data)
    params.append('indRangeScore', payload.ind_range)
    params.append('formula', payload.formula)
    params.append('formulaInd', payload.formula_ind)
    params.append('decimals', payload.decimals)
    params.append('isCalc', payload.is_calc)
    axios({
      method: 'PUT',
      url: '/v1/ind',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  delete (cb, payload) {
    axios({
      method: 'DELETE',
      url: '/v1/ind/' + payload.id,
      params: {
        'userId': 1
      }
    }).then(res => {
      cb(res.data)
    })
  },
  changeOrder (cb, payload) {
    const params = new URLSearchParams()
    params.append('inds', JSON.stringify(payload))
    axios({
      method: 'PUT',
      url: '/v1/ind/order',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  getDetailStatus (cb, id) {
    axios({
      method: 'GET',
      url: '/v1/ind/' + id + '/isdetail'
    }).then(res => {
      cb(res.data)
    })
  }
}
