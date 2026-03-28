import { ImageResponse } from 'next/og';

export const alt = 'Calc My Bets - Free Sports Betting Calculators';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%)',
          color: '#1d1d1f',
          padding: '72px',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', color: '#0071e3' }}>
          Calc My Bets
        </div>
        <div style={{ marginTop: 18, fontSize: 68, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          Sports Betting
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          Calculator Suite
        </div>
        <div style={{ marginTop: 26, fontSize: 30, color: '#5f5f64', lineHeight: 1.35 }}>
          Single Bets, Parlay Odds, EV, and Odds Conversion
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
