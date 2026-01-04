import UnsubscribeClient from "./unsubscribe-client";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const params = await searchParams;
    const token = params.token ?? null;

    return <UnsubscribeClient token={token} />;
}
