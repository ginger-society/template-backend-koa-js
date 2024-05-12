import prom from 'prom-client'

const collectDefaultMetrics = prom.collectDefaultMetrics
collectDefaultMetrics({ prefix: 'forethought' })

export default prom
