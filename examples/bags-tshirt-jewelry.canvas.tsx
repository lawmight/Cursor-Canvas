/**
 * Example canvas used to test the publish-canvas skill.
 * Imports only from `cursor/canvas`, like every IDE-generated canvas.
 */
import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Grid,
  H1,
  H2,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  type ChartSeries,
} from 'cursor/canvas';

const SALES: ChartSeries[] = [
  { name: 'Bags', data: [120, 145, 160, 152, 180, 210], tone: 'info' },
  { name: 'T-Shirts', data: [200, 190, 220, 260, 240, 280], tone: 'success' },
  { name: 'Jewelry', data: [80, 95, 90, 110, 130, 150], tone: 'warning' },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function ShopDashboard() {
  return (
    <Stack gap={16}>
      <Row align="center" gap={8}>
        <H1>Shop Overview</H1>
        <Pill tone="success">live</Pill>
      </Row>
      <Text tone="secondary">
        Bags, t-shirts, and jewelry sales for the first half of the year.
      </Text>

      <Grid columns={3} gap={12}>
        <Stat label="Bags sold" value="967" delta={12} />
        <Stat label="T-shirts sold" value="1,390" delta={8} />
        <Stat label="Jewelry sold" value="655" delta={21} />
      </Grid>

      <Card>
        <CardHeader>
          <H2>Monthly sales</H2>
        </CardHeader>
        <CardBody>
          <BarChart series={SALES} categories={MONTHS} height={260} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <H2>Top products</H2>
        </CardHeader>
        <CardBody>
          <Table
            headers={['Product', 'Category', 'Units', 'Revenue']}
            rows={[
              ['Canvas Tote', 'Bags', '312', '$9,360'],
              ['Logo Tee', 'T-Shirts', '540', '$13,500'],
              ['Silver Pendant', 'Jewelry', '188', '$11,280'],
            ]}
          />
        </CardBody>
      </Card>

      <Callout tone="info" title="Note">
        Jewelry has the fastest growth; consider expanding the collection.
      </Callout>
    </Stack>
  );
}
