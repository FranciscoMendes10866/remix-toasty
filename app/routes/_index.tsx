import {
  json,
  type DataFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect } from "react";
import notify, { Toaster } from "react-hot-toast";
import { getToast, redirectWithError, redirectWithSuccess } from "remix-toast";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";

import { Input } from "~/components/Input";
import { SubmitButton } from "~/components/SubmitButton";
import { db } from "~/db";
import { users } from "~/db/schema";

export const meta: MetaFunction = () => {
  return [
    { title: "List" },
    { name: "description", content: "List page content" },
  ];
};

export const validator = withZod(
  z.object({
    username: z.string().min(1, { message: "Required" }),
  })
);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  const datums = await db.query.users.findMany();
  return json({ toast, datums }, { headers });
};

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const result = await validator.validate(await request.formData());
    if (result.error) return validationError(result.error);
    await db.insert(users).values({ username: result.data.username });
    return redirectWithSuccess("/", "Successful operation");
  } catch {
    return redirectWithError("/", "An error occurred");
  }
};

export default function Index() {
  const { toast, datums } = useLoaderData<typeof loader>();

  useEffect(() => {
    switch (toast?.type) {
      case "success":
        notify.success(toast.message);
        return;
      case "error":
        notify.error(toast.message);
        return;
      default:
        return;
    }
  }, [toast]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Toaster />

      <div className="w-2/4 space-y-4">
        <ValidatedForm validator={validator} method="post">
          <div className="flex space-x-4">
            <div className="w-full">
              <Input name="username" label="Username" />
            </div>
            <SubmitButton />
          </div>
        </ValidatedForm>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Name
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {datums.map((datum) => (
                <tr key={datum.id}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {datum.username}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
