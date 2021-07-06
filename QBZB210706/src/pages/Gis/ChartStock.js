import React from 'react';
import echarts from 'echarts';
import styles from './Chart.less';

export default class Chart extends React.PureComponent {

  constructor(props){
    super(props);
    this.state={
      translateX: 0,
      translateY: 0,
    };
    this.moving = false;
    this.lastX = null;
    this.lastY = null;
    window.onmouseup = e => this.onMouseUp(e);
    window.onmousemove = e => this.onMouseMove(e);
  }

  componentDidMount() {
    const { chartData } = this.props;
    if (!chartData) return;
    const chart = echarts.init(this.container);
    const { xData, yData, max, maxIndex, min, minIndex, cIndex, cValue } = chartData;
    const markPoints = [];
    if (typeof max === 'number') {
      markPoints.push({ value: 'A', coord: [maxIndex, max], itemStyle: { color: '#2884D8' } });
    }
    if (typeof min === 'number') {
      markPoints.push({ value: 'B', coord: [minIndex, min], itemStyle: { color: '#2884D8' } })
    }
    if (typeof cValue === 'number') {
      const point = { value: 'C', coord: [cIndex, cValue], itemStyle: { color: '#F5222D' } };
      if (cIndex === maxIndex) { // 倾斜使得
        point.symbolRotate = 45;
        point.label = { rotate: 45, offset: [ 0, 3 ] };
      }
      markPoints.push(point)
    }

    chart.setOption({
      grid: {
        left: 48,
        top: 45,
        right: 75,
        bottom: 31,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
        name: '距离 (km)'
      },
      yAxis: { type: 'value', name: '高程 (m)' },
      series: [{
        type: 'line',
        name: 'height',
        data: yData,
        areaStyle: {
          color: 'rgb(250,140,22)',
          opacity: 0.1,
        },
        lineStyle: {
          color: '#FA8C16',
          width: 3,
        },
        markPoint: {
          symbolSize: [25, 30],
          data: markPoints,
        },
      }],
    });
  }

  onMouseDown(e){
    e.stopPropagation();
    this.moving = true;
  }

  onMouseUp(){
    this.moving = false;
    this.lastX = null;
    this.lastY = null;
  }

  onMouseMove(e){
    this.moving && this.onMove(e);
  }

  onMove(e){
    if(this.lastX && this.lastY){
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.setState({
        translateX: this.state.translateX + dx,
        translateY: this.state.translateY + dy,
      })
    }
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }



  render() {
    const { handleClose } = this.props;

    return(
      <div
        className={styles.wrapper}
        onMouseDown={e=> this.onMouseDown(e)}
        style={{transform:`translateX(${this.state.translateX}px)translateY(${this.state.translateY}px)`,cursor:'move'}}
      >
        <div className={styles.title}>
        剖面分析
          <span onClick={handleClose} className={styles.close}>×</span>
        </div>
        <div className={styles.body}>
          <div ref={container => { this.container = container }} style={{ height: 290 }} />
          {/* <div className={styles.text}>
            {
              typeof maxIndex === 'number' &&
              <div><span className={styles.blueCircle} /> 最高点A ({maxCoords[0].toFixed(2)}°,{maxCoords[1].toFixed(2)}°): {xData[maxIndex]} km</div>
            }
            {
              typeof minIndex === 'number' &&
              <div><span className={styles.blueCircle} /> 最低点B ({minCoords[0].toFixed(2)}°,{minCoords[1].toFixed(2)}°): {xData[minIndex]} km</div>
            }
            {
              typeof cIndex === 'number' &&
              <div className={styles.red}><span className={styles.redCircle} /> 两点之间不可通视，最近障碍点C({cCoords[0].toFixed(2)}°,{cCoords[1].toFixed(2)}°): {xData[cIndex]} km</div>
            }
          </div> */}
        </div>
      </div>
    )
  }
}
